import Foundation
import Capacitor
import UIKit
import UserNotifications
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
public class LiftWidgetsPlugin: CAPPlugin, CAPBridgedPlugin, PHPickerViewControllerDelegate, UIDocumentPickerDelegate, WCSessionDelegate {
    public let identifier = "LiftWidgetsPlugin"
    public let jsName = "LiftWidgets"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setSnapshot", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startRest", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "endRest", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "healthAuth", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "healthSave", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "healthWeight", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "readPlan", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "duck", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "haptic", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "keepAwake", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "watchAct", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "shareStory", returnType: CAPPluginReturnPromise)
    ]

    // The Watch gets the same snapshot and the rest end time, over WatchConnectivity.
    private var watchCtx: [String: Any] = [:]
    override public func load() {
        // THE REST TONES MUST NOT STOP THE MUSIC: the page's sounds play on top of whatever is playing.
        mixAudio()
        NotificationCenter.default.addObserver(forName: UIApplication.didBecomeActiveNotification, object: nil, queue: .main) { [weak self] _ in self?.mixAudio() }
        #if canImport(WatchConnectivity)
        if WCSession.isSupported() { WCSession.default.delegate = self; WCSession.default.activate() }
        #endif
    }
    private func mixAudio() {
        // set, but not switched on: the page's own sounds never take the music over
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [.mixWithOthers])
    }


    // ── The watch: the set you are on goes over, a set done or a workout started comes back.
    @objc func watchAct(_ call: CAPPluginCall) {
        let j = call.getString("json") ?? ""
        toWatch("act", j)
        call.resolve()
    }

    #if canImport(WatchConnectivity)
    public func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}
    public func sessionDidBecomeInactive(_ session: WCSession) {}
    public func sessionDidDeactivate(_ session: WCSession) { session.activate() }
    public func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        DispatchQueue.main.async { self.notifyListeners("watchMsg", data: message, retainUntilConsumed: true) }
    }
    public func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any]) {
        DispatchQueue.main.async { self.notifyListeners("watchMsg", data: userInfo, retainUntilConsumed: true) }
    }
    #endif

    // ── Haptics: a real tap for a tick, a success for a finish, two for a rest that is ready, three hard ones for a rest gone over.
    @objc func haptic(_ call: CAPPluginCall) {
        let kind = call.getString("kind") ?? "tick"
        DispatchQueue.main.async {
            switch kind {
            case "success": UINotificationFeedbackGenerator().notificationOccurred(.success)
            case "ready":
                let g = UIImpactFeedbackGenerator(style: .medium); g.impactOccurred()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.14) { g.impactOccurred() }
            case "over":
                let g = UIImpactFeedbackGenerator(style: .heavy)
                for i in 0..<3 { DispatchQueue.main.asyncAfter(deadline: .now() + Double(i) * 0.16) { g.impactOccurred() } }
            case "medium": UIImpactFeedbackGenerator(style: .medium).impactOccurred()
            default: UIImpactFeedbackGenerator(style: .light).impactOccurred()
            }
        }
        call.resolve()
    }

    // ── The screen stays on while a workout is going.
    @objc func keepAwake(_ call: CAPPluginCall) {
        let on = call.getBool("on") ?? false
        DispatchQueue.main.async { UIApplication.shared.isIdleTimerDisabled = on }
        call.resolve()
    }

    // ── "Rest is over", with the app closed: a notification at the end of the target. Asked for the first time a rest starts.
    private func scheduleRestNote(end: Date, next: String) {
        let c = UNUserNotificationCenter.current()
        c.removePendingNotificationRequests(withIdentifiers: ["lift.rest.over"])
        c.requestAuthorization(options: [.alert, .sound]) { ok, _ in
            guard ok, end.timeIntervalSinceNow > 1 else { return }
            let n = UNMutableNotificationContent()
            n.title = "Rest is over"
            n.body = next.isEmpty ? "Next set" : "Next: " + next
            n.sound = .default
            if #available(iOS 15.0, *) { n.interruptionLevel = .timeSensitive }
            c.add(UNNotificationRequest(identifier: "lift.rest.over", content: n, trigger: UNTimeIntervalNotificationTrigger(timeInterval: end.timeIntervalSinceNow, repeats: false)))
        }
    }
    private func cancelRestNote() { UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["lift.rest.over"]) }


    // ── A story: the card's video goes straight into Instagram's or Facebook's story editor as the background, or into the share sheet.
    @objc func shareStory(_ call: CAPPluginCall) {
        guard let b64 = call.getString("data"), let data = Data(base64Encoded: b64) else { call.reject("no video"); return }
        let kind = call.getString("kind") ?? "sheet"
        let ext = call.getString("ext") ?? "mp4"
        let appId = (call.getString("appId") ?? "").isEmpty ? (Bundle.main.bundleIdentifier ?? "") : (call.getString("appId") ?? "")
        DispatchQueue.main.async {
            if kind == "instagram" || kind == "facebook" {
                let scheme = kind == "instagram" ? "instagram-stories" : "facebook-stories"
                let key = kind == "instagram" ? "com.instagram.sharedSticker.backgroundVideo" : "com.facebook.sharedSticker.backgroundVideo"
                if let url = URL(string: scheme + "://share?source_application=" + appId), UIApplication.shared.canOpenURL(url) {
                    var item: [String: Any] = [key: data]
                    if kind == "facebook" { item["com.facebook.sharedSticker.appID"] = appId }
                    UIPasteboard.general.setItems([item], options: [.expirationDate: Date().addingTimeInterval(300)])
                    UIApplication.shared.open(url, options: [:]) { _ in call.resolve(["ok": true, "via": kind]) }
                    return
                }
            }
            // the other app is not there (or this is the share sheet): the phone's own sheet, with the video as a file
            let tmp = FileManager.default.temporaryDirectory.appendingPathComponent("lift-story." + ext)
            try? data.write(to: tmp)
            guard let vc = self.bridge?.viewController else { call.resolve(["ok": false]); return }
            let sheet = UIActivityViewController(activityItems: [tmp], applicationActivities: nil)
            if let pop = sheet.popoverPresentationController { pop.sourceView = vc.view; pop.sourceRect = CGRect(x: vc.view.bounds.midX, y: vc.view.bounds.maxY - 40, width: 1, height: 1) }
            sheet.completionWithItemsHandler = { _, done, _, _ in call.resolve(["ok": done, "via": "sheet"]) }
            vc.present(sheet, animated: true)
        }
    }

    /// The music dips while a rest tone plays and comes back on its own: it is lowered, never stopped.
    @objc func duck(_ call: CAPPluginCall) {
        let ms = min(max(call.getDouble("ms") ?? 1200, 200), 4000)
        let s = AVAudioSession.sharedInstance()
        try? s.setCategory(.playback, mode: .default, options: [.mixWithOthers, .duckOthers])
        try? s.setActive(true, options: [])
        DispatchQueue.main.asyncAfter(deadline: .now() + ms / 1000) {
            try? s.setActive(false, options: .notifyOthersOnDeactivation)
            try? s.setCategory(.playback, mode: .default, options: [.mixWithOthers])
        }
        call.resolve()
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
            scheduleRestNote(end: end, next: next)
            Task {
                for a in Activity<LiftRestAttributes>.activities { await a.end(nil, dismissalPolicy: .immediate) }
                guard ActivityAuthorizationInfo().areActivitiesEnabled, end > Date() else { call.resolve(); return }
                let state = LiftRestAttributes.ContentState(end: end, next: next)
                do {
                    _ = try Activity.request(attributes: LiftRestAttributes(title: "Rest", accent: accent),
                                             content: .init(state: state, staleDate: end), pushType: nil)
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
        cancelRestNote()
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
