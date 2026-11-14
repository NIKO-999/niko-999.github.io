import Foundation
import Capacitor
import UIKit
import AVFoundation
import Vision
import PDFKit
import PhotosUI
import UniformTypeIdentifiers
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
public class LiftWidgetsPlugin: CAPPlugin, CAPBridgedPlugin, PHPickerViewControllerDelegate, UIDocumentPickerDelegate {
    public let identifier = "LiftWidgetsPlugin"
    public let jsName = "LiftWidgets"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setSnapshot", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startRest", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "endRest", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "healthAuth", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "healthSave", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "healthWeight", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "readPlan", returnType: CAPPluginReturnPromise)
    ]

    // The Watch gets the same snapshot and the rest end time, over WatchConnectivity.
    private var watchCtx: [String: Any] = [:]
    override public func load() {
        // THE REST TONES MUST NOT STOP THE MUSIC: the page's sounds play on top of whatever is playing.
        mixAudio()
        NotificationCenter.default.addObserver(forName: UIApplication.didBecomeActiveNotification, object: nil, queue: .main) { [weak self] _ in self?.mixAudio() }
        #if canImport(WatchConnectivity)
        if WCSession.isSupported() { WCSession.default.activate() }
        #endif
    }
    private func mixAudio() {
        let s = AVAudioSession.sharedInstance()
        try? s.setCategory(.playback, mode: .default, options: [.mixWithOthers])
        try? s.setActive(true, options: [])
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

    // ── Read a routine: a photo, a screenshot or a PDF becomes lines of text, on this phone. Nothing is uploaded.
    private var planCall: CAPPluginCall?

    @objc func readPlan(_ call: CAPPluginCall) {
        planCall = call
        let kind = call.getString("kind") ?? "photo"
        DispatchQueue.main.async {
            guard let vc = self.bridge?.viewController else { call.resolve(["lines": []]); self.planCall = nil; return }
            if kind == "file" {
                let p = UIDocumentPickerViewController(forOpeningContentTypes: [.pdf, .image], asCopy: true)
                p.delegate = self
                vc.present(p, animated: true)
            } else {
                var cfg = PHPickerConfiguration(); cfg.filter = .images; cfg.selectionLimit = 1
                let p = PHPickerViewController(configuration: cfg)
                p.delegate = self
                vc.present(p, animated: true)
            }
        }
    }

    private func finishPlan(_ lines: [String]) {
        planCall?.resolve(["lines": lines]); planCall = nil
    }

    public func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
        picker.dismiss(animated: true)
        guard let r = results.first, r.itemProvider.canLoadObject(ofClass: UIImage.self) else { finishPlan([]); return }
        r.itemProvider.loadObject(ofClass: UIImage.self) { obj, _ in
            guard let img = obj as? UIImage else { self.finishPlan([]); return }
            self.ocr(img) { self.finishPlan($0) }
        }
    }

    public func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        guard let u = urls.first else { finishPlan([]); return }
        if u.pathExtension.lowercased() == "pdf", let doc = PDFDocument(url: u) {
            var text: [String] = []
            for i in 0..<min(doc.pageCount, 12) { if let s = doc.page(at: i)?.string { text.append(s) } }
            let joined = text.joined(separator: "\n")
            if joined.trimmingCharacters(in: .whitespacesAndNewlines).count > 20 {
                finishPlan(joined.components(separatedBy: .newlines)); return
            }
            // a scanned PDF has no text in it: draw each page and read the picture
            var imgs: [UIImage] = []
            for i in 0..<min(doc.pageCount, 6) {
                guard let pg = doc.page(at: i) else { continue }
                let r = pg.bounds(for: .mediaBox), sc: CGFloat = 2
                let ir = UIGraphicsImageRenderer(size: CGSize(width: r.width * sc, height: r.height * sc))
                imgs.append(ir.image { c in
                    UIColor.white.set(); c.fill(CGRect(origin: .zero, size: ir.format.bounds.size))
                    c.cgContext.translateBy(x: 0, y: r.height * sc); c.cgContext.scaleBy(x: sc, y: -sc)
                    pg.draw(with: .mediaBox, to: c.cgContext)
                })
            }
            readAll(imgs, [])
        } else if let img = UIImage(contentsOfFile: u.path) {
            ocr(img) { self.finishPlan($0) }
        } else { finishPlan([]) }
    }

    public func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) { finishPlan([]) }

    private func readAll(_ imgs: [UIImage], _ acc: [String]) {
        guard let first = imgs.first else { finishPlan(acc); return }
        ocr(first) { self.readAll(Array(imgs.dropFirst()), acc + $0) }
    }

    /// Apple's text recognition. Words on the same row are joined left to right, so a table row stays one line.
    private func ocr(_ img: UIImage, _ done: @escaping ([String]) -> Void) {
        guard let cg = img.cgImage else { done([]); return }
        let req = VNRecognizeTextRequest { r, _ in
            let obs = (r.results as? [VNRecognizedTextObservation]) ?? []
            let items = obs.compactMap { o -> (CGFloat, CGFloat, CGFloat, String)? in
                guard let s = o.topCandidates(1).first?.string else { return nil }
                return (o.boundingBox.midY, o.boundingBox.minX, o.boundingBox.height, s)
            }.sorted { $0.0 > $1.0 }
            var rows: [[(CGFloat, CGFloat, CGFloat, String)]] = []
            for it in items {
                if var last = rows.last, let f = last.first, abs(f.0 - it.0) < max(f.2, it.2) * 0.6 { last.append(it); rows[rows.count - 1] = last }
                else { rows.append([it]) }
            }
            done(rows.map { $0.sorted { $0.1 < $1.1 }.map { $0.3 }.joined(separator: " ") })
        }
        req.recognitionLevel = .accurate
        req.usesLanguageCorrection = false
        DispatchQueue.global(qos: .userInitiated).async {
            try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
        }
    }
}
