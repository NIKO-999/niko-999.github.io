import SwiftUI
import WatchConnectivity
import UserNotifications
import WatchKit

/// The Watch side of Lift. The phone sends the same small snapshot the widgets use (today's routine, the
/// week, the streak) and the end time of the rest between sets. Nothing is stored here but the last copy.
struct WSnap: Codable {
    var accent: String?
    var today: Today?
    var week: Week?
    var streak: Int?
    struct Today: Codable { var name: String; var sub: String?; var done: Bool; var rest: Bool? }
    struct Week: Codable { var n: Int; var goal: Int; var days: [Int] }
}

/// The set the phone says you are on: which exercise, which set, and the weight and reps it would log.
struct WAct: Codable, Equatable {
    var n: String?
    var ex: String?
    var id: String?
    var i: Int?
    var of: Int?
    var w: Double?
    var r: Int?
    var u: String?
    var st: Double?
    var bw: Bool?
    var done: Int?
}

final class Link: NSObject, ObservableObject, WCSessionDelegate {
    @Published var act: WAct?
    @Published var snap: WSnap?
    @Published var restEnd: Date?
    @Published var next: String = ""

    override init() {
        super.init()
        if let s = UserDefaults.standard.string(forKey: "snap") { apply(snapJSON: s) }
        if WCSession.isSupported() { WCSession.default.delegate = self; WCSession.default.activate() }
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { _, _ in }
    }

    func apply(snapJSON: String) {
        if let d = snapJSON.data(using: .utf8), let s = try? JSONDecoder().decode(WSnap.self, from: d) { snap = s }
    }

    func send(_ m: [String: Any]) {
        guard WCSession.isSupported() else { return }
        let s = WCSession.default
        if s.isReachable { s.sendMessage(m, replyHandler: nil, errorHandler: { _ in s.transferUserInfo(m) }) } else { s.transferUserInfo(m) }
    }

    func apply(_ ctx: [String: Any]) {
        DispatchQueue.main.async {
            if ctx.keys.contains("act") {
                if let j = ctx["act"] as? String, let d = j.data(using: .utf8), let a = try? JSONDecoder().decode(WAct.self, from: d) { self.act = a } else { self.act = nil }
            }
            if let s = ctx["snap"] as? String { self.apply(snapJSON: s); UserDefaults.standard.set(s, forKey: "snap") }
            if let ms = ctx["restEnd"] as? Double {
                let e = Date(timeIntervalSince1970: ms / 1000)
                self.next = ctx["next"] as? String ?? ""
                if e > Date() { self.restEnd = e; self.schedule(e) } else { self.restEnd = nil; self.cancel() }
            } else if ctx.keys.contains("restEnd") { self.restEnd = nil; self.cancel() }
        }
    }

    /// A tap on the wrist when the rest is up, even if the app is not on screen.
    private func schedule(_ end: Date) {
        cancel()
        let c = UNMutableNotificationContent(); c.title = "Rest is over"; c.body = next.isEmpty ? "Next set" : next; c.sound = .default
        let t = UNTimeIntervalNotificationTrigger(timeInterval: max(1, end.timeIntervalSinceNow), repeats: false)
        UNUserNotificationCenter.current().add(UNNotificationRequest(identifier: "lift.rest", content: c, trigger: t))
    }
    private func cancel() { UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["lift.rest"]) }

    func session(_ session: WCSession, activationDidCompleteWith state: WCSessionActivationState, error: Error?) {
        if !session.receivedApplicationContext.isEmpty { apply(session.receivedApplicationContext) }
    }
    func session(_ session: WCSession, didReceiveApplicationContext ctx: [String: Any]) { apply(ctx) }
}

extension Color {
    init(hex: String?) {
        var s = (hex ?? "#a3e635").trimmingCharacters(in: .whitespaces)
        if s.hasPrefix("#") { s.removeFirst() }
        if s.count == 3 { s = s.map { "\($0)\($0)" }.joined() }
        var v: UInt64 = 0; Scanner(string: s).scanHexInt64(&v)
        self.init(red: Double((v >> 16) & 255) / 255, green: Double((v >> 8) & 255) / 255, blue: Double(v & 255) / 255)
    }
}

struct RestView: View {
    let end: Date; let next: String; let accent: Color
    var body: some View {
        VStack(spacing: 6) {
            Text("REST").font(.caption2).foregroundStyle(.secondary)
            Text(timerInterval: Date()...max(end, Date().addingTimeInterval(1)), countsDown: true)
                .font(.system(size: 52, weight: .bold, design: .rounded)).monospacedDigit().foregroundStyle(accent)
            if !next.isEmpty { Text(next).font(.footnote).foregroundStyle(.secondary).lineLimit(2).multilineTextAlignment(.center) }
        }
    }
}

struct TodayView: View {
    let snap: WSnap?; let accent: Color; let start: () -> Void
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("TODAY").font(.caption2).foregroundStyle(.secondary)
            if let t = snap?.today {
                Text(t.rest == true ? "Rest day" : t.name).font(.title3.weight(.bold)).lineLimit(2)
                if let s = t.sub, !s.isEmpty, t.rest != true { Text(s).font(.footnote).foregroundStyle(.secondary).lineLimit(2) }
                if t.done { Label("Done", systemImage: "checkmark.circle.fill").font(.footnote).foregroundStyle(accent) }
                else if t.rest != true { Button("Start", action: start).tint(accent).buttonStyle(.borderedProminent) }
            } else { Text("Open Lift on your iPhone").font(.footnote).foregroundStyle(.secondary) }
            Spacer(minLength: 0)
        }.frame(maxWidth: .infinity, alignment: .leading)
    }
}

struct WeekView: View {
    let snap: WSnap?; let accent: Color
    var body: some View {
        let n = snap?.week?.n ?? 0, goal = max(snap?.week?.goal ?? 0, 1)
        VStack(spacing: 8) {
            ZStack {
                Circle().stroke(Color.white.opacity(0.15), lineWidth: 10)
                Circle().trim(from: 0, to: min(1, Double(n) / Double(goal))).stroke(accent, style: StrokeStyle(lineWidth: 10, lineCap: .round)).rotationEffect(.degrees(-90))
                VStack(spacing: 0) { Text("\(n)").font(.system(size: 34, weight: .bold, design: .rounded)); Text("of \(snap?.week?.goal ?? 0)").font(.caption2).foregroundStyle(.secondary) }
            }.frame(width: 100, height: 100)
            HStack(spacing: 4) {
                ForEach(Array((snap?.week?.days ?? []).enumerated()), id: \.offset) { _, d in
                    Circle().fill(d == 1 ? accent : Color.white.opacity(d == 2 ? 0.35 : 0.15)).frame(width: 9, height: 9)
                }
            }
            if let s = snap?.streak, s > 0 { Text("\(s)-week streak").font(.footnote).foregroundStyle(.secondary) }
        }
    }
}

struct WorkoutView: View {
    @ObservedObject var link: Link
    let act: WAct; let accent: Color
    @State private var w: Double = 0
    @State private var r: Int = 8
    @State private var key = ""

    private var step: Double { act.st ?? 2.5 }
    private func fmt(_ v: Double) -> String { act.bw == true && v == 0 ? "BW" : (v == v.rounded() ? String(Int(v)) : String(format: "%.1f", v)) }

    var body: some View {
        if act.done == 1 {
            VStack(spacing: 6) { Image(systemName: "checkmark.circle.fill").font(.largeTitle).foregroundStyle(accent); Text("All sets done").font(.headline); Text("Finish on your iPhone").font(.footnote).foregroundStyle(.secondary) }
        } else {
            let k = "\(act.id ?? "")-\(act.i ?? 0)-\(act.w ?? 0)-\(act.r ?? 0)"
            ScrollView {
                VStack(spacing: 8) {
                    Text(act.ex ?? "").font(.headline).lineLimit(2).multilineTextAlignment(.center)
                    Text("Set \((act.i ?? 0) + 1) of \(act.of ?? 0)").font(.caption2).foregroundStyle(.secondary)
                    HStack {
                        Button { w = max(0, w - step) } label: { Image(systemName: "minus") }.buttonStyle(.bordered).frame(width: 44)
                        VStack(spacing: 0) { Text(fmt(w)).font(.system(size: 26, weight: .bold, design: .rounded)).monospacedDigit(); Text(act.u ?? "kg").font(.caption2).foregroundStyle(.secondary) }.frame(maxWidth: .infinity)
                        Button { w += step } label: { Image(systemName: "plus") }.buttonStyle(.bordered).frame(width: 44)
                    }
                    HStack {
                        Button { r = max(1, r - 1) } label: { Image(systemName: "minus") }.buttonStyle(.bordered).frame(width: 44)
                        VStack(spacing: 0) { Text("\(r)").font(.system(size: 26, weight: .bold, design: .rounded)).monospacedDigit(); Text("reps").font(.caption2).foregroundStyle(.secondary) }.frame(maxWidth: .infinity)
                        Button { r += 1 } label: { Image(systemName: "plus") }.buttonStyle(.bordered).frame(width: 44)
                    }
                    Button {
                        link.send(["t": "set", "id": act.id ?? "", "i": act.i ?? 0, "w": w, "r": r])
                        WKInterfaceDevice.current().play(.success)
                    } label: { Text("Done").font(.headline).frame(maxWidth: .infinity) }.tint(accent).buttonStyle(.borderedProminent)
                }
            }
            .onAppear { w = act.w ?? 0; r = act.r ?? 8; key = k }
            .onChange(of: k) { _ in w = act.w ?? 0; r = act.r ?? 8; key = k }
        }
    }
}

struct RootView: View {
    @StateObject var link = Link()
    var body: some View {
        let accent = Color(hex: link.snap?.accent)
        if let e = link.restEnd, e > Date() {
            RestView(end: e, next: link.next, accent: accent)
        } else {
            if let a = link.act {
                WorkoutView(link: link, act: a, accent: accent)
            } else {
                TabView { TodayView(snap: link.snap, accent: accent, start: { link.send(["t": "start"]) }); WeekView(snap: link.snap, accent: accent) }
                    .tabViewStyle(.page)
            }
        }
    }
}

@main
struct LiftWatchApp: App {
    var body: some Scene { WindowGroup { RootView() } }
}
