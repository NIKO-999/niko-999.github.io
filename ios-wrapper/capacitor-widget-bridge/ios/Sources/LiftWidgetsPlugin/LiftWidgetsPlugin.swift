import Foundation
import Capacitor
#if canImport(WidgetKit)
import WidgetKit
#endif
#if canImport(ActivityKit)
import ActivityKit
#endif
#if canImport(HealthKit)
import HealthKit
#endif
#if canImport(WatchConnectivity)
import WatchConnectivity
#endif

/// Two jobs. setSnapshot writes the little JSON the widgets read into the App Group and asks them to
/// redraw. startRest / endRest run the rest between sets as a Live Activity on the Lock Screen.
/// Nothing here reads a set, a weight or a note: the page decides what goes, and it sends counts and names.
@objc(LiftWidgetsPlugin)
public class LiftWidgetsPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "LiftWidgetsPlugin"
    public let jsName = "LiftWidgets"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setSnapshot", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startRest", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "endRest", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "healthAuth", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "healthSave", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "healthWeight", returnType: CAPPluginReturnPromise)
    ]

    // The Watch gets the same snapshot and the rest end time, over WatchConnectivity.
    private var watchCtx: [String: Any] = [:]
    override public func load() {
        #if canImport(WatchConnectivity)
        if WCSession.isSupported() { WCSession.default.activate() }
        #endif
    }
    private func toWatch(_ k: String, _ v: Any?) {
        #if canImport(WatchConnectivity)
        guard WCSession.isSupported() else { return }
        if let v = v { watchCtx[k] = v } else { watchCtx.removeValue(forKey: k) }
        let s = WCSession.default
        if s.activationState == .activated && s.isWatchAppInstalled { try? s.updateApplicationContext(watchCtx) }
        #endif
    }

    private var groupId: String { "group." + (Bundle.main.bundleIdentifier ?? "") }

    @objc func setSnapshot(_ call: CAPPluginCall) {
        guard let json = call.getString("json") else { call.reject("no snapshot"); return }
        UserDefaults(suiteName: groupId)?.set(json, forKey: "lift.snapshot")
        toWatch("snap", json)
        #if canImport(WidgetKit)
        if #available(iOS 14.0, *) { WidgetCenter.shared.reloadAllTimelines() }
        #endif
        call.resolve()
    }

    @objc func startRest(_ call: CAPPluginCall) {
        #if canImport(ActivityKit)
        if #available(iOS 16.2, *) {
            let ms = call.getDouble("end") ?? 0
            let end = Date(timeIntervalSince1970: ms / 1000)
            let next = call.getString("next") ?? ""
            let accent = call.getString("accent") ?? "#a3e635"
            toWatch("next", next); toWatch("restEnd", ms)
            Task {
                for a in Activity<LiftRestAttributes>.activities { await a.end(nil, dismissalPolicy: .immediate) }
                guard ActivityAuthorizationInfo().areActivitiesEnabled, end > Date() else { call.resolve(); return }
                let state = LiftRestAttributes.ContentState(end: end, next: next)
                do {
                    _ = try Activity.request(attributes: LiftRestAttributes(title: "Rest", accent: accent),
                                             content: .init(state: state, staleDate: end.addingTimeInterval(30)), pushType: nil)
                } catch { }
                call.resolve()
            }
            return
        }
        #endif
        call.resolve()
    }

    @objc func endRest(_ call: CAPPluginCall) {
        toWatch("restEnd", 0.0)
        #if canImport(ActivityKit)
        if #available(iOS 16.2, *) {
            Task {
                for a in Activity<LiftRestAttributes>.activities { await a.end(nil, dismissalPolicy: .immediate) }
                call.resolve()
            }
            return
        }
        #endif
        call.resolve()
    }

    // ── Apple Health: a strength workout goes in (start, end, name) and the latest body weight comes out.
    #if canImport(HealthKit)
    private let hs = HKHealthStore()
    #endif

    @objc func healthAuth(_ call: CAPPluginCall) {
        #if canImport(HealthKit)
        guard HKHealthStore.isHealthDataAvailable(), let mass = HKObjectType.quantityType(forIdentifier: .bodyMass) else { call.resolve(["ok": false]); return }
        hs.requestAuthorization(toShare: [HKObjectType.workoutType()], read: [mass]) { ok, _ in call.resolve(["ok": ok]) }
        #else
        call.resolve(["ok": false])
        #endif
    }

    @objc func healthSave(_ call: CAPPluginCall) {
        #if canImport(HealthKit)
        guard HKHealthStore.isHealthDataAvailable() else { call.resolve(["ok": false]); return }
        let s = Date(timeIntervalSince1970: (call.getDouble("start") ?? 0) / 1000)
        var e = Date(timeIntervalSince1970: (call.getDouble("end") ?? 0) / 1000)
        if e <= s { e = s.addingTimeInterval(60) }
        let cfg = HKWorkoutConfiguration()
        cfg.activityType = .traditionalStrengthTraining
        let b = HKWorkoutBuilder(healthStore: hs, configuration: cfg, device: .local())
        b.beginCollection(withStart: s) { ok, _ in
            guard ok else { call.resolve(["ok": false]); return }
            b.endCollection(withEnd: e) { ok2, _ in
                guard ok2 else { call.resolve(["ok": false]); return }
                b.finishWorkout { w, _ in call.resolve(["ok": w != nil]) }
            }
        }
        #else
        call.resolve(["ok": false])
        #endif
    }

    @objc func healthWeight(_ call: CAPPluginCall) {
        #if canImport(HealthKit)
        guard HKHealthStore.isHealthDataAvailable(), let mass = HKObjectType.quantityType(forIdentifier: .bodyMass) else { call.resolve([:]); return }
        let q = HKSampleQuery(sampleType: mass, predicate: nil, limit: 1, sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)]) { _, r, _ in
            guard let m = r?.first as? HKQuantitySample else { call.resolve([:]); return }
            call.resolve(["kg": m.quantity.doubleValue(for: .gramUnit(with: .kilo)), "t": m.endDate.timeIntervalSince1970 * 1000])
        }
        hs.execute(q)
        #else
        call.resolve([:])
        #endif
    }
}
