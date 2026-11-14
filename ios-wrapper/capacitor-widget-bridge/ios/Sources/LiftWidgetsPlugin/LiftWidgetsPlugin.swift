import Foundation
import Capacitor
#if canImport(WidgetKit)
import WidgetKit
#endif
#if canImport(ActivityKit)
import ActivityKit
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
        CAPPluginMethod(name: "endRest", returnType: CAPPluginReturnPromise)
    ]

    private var groupId: String { "group." + (Bundle.main.bundleIdentifier ?? "") }

    @objc func setSnapshot(_ call: CAPPluginCall) {
        guard let json = call.getString("json") else { call.reject("no snapshot"); return }
        UserDefaults(suiteName: groupId)?.set(json, forKey: "lift.snapshot")
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
}
