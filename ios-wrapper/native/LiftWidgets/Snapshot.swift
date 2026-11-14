import SwiftUI
import WidgetKit

/// What the app hands the widgets: counts and names, nothing else.
struct LiftSnap: Codable {
    var d: String?
    var accent: String?
    var unit: String?
    var today: Today?
    var week: Week?
    var streak: Int?
    var badge: Badge?

    struct Today: Codable { var name: String; var sub: String?; var done: Bool; var rest: Bool? }
    struct Week: Codable { var n: Int; var goal: Int; var days: [Int] }
    struct Badge: Codable { var name: String; var d: String? }

    static var groupId: String {
        var id = Bundle.main.bundleIdentifier ?? ""
        if id.hasSuffix(".widgets") { id = String(id.dropLast(".widgets".count)) }
        return "group." + id
    }

    static func load() -> LiftSnap? {
        guard let s = UserDefaults(suiteName: groupId)?.string(forKey: "lift.snapshot"),
              let data = s.data(using: .utf8) else { return nil }
        return try? JSONDecoder().decode(LiftSnap.self, from: data)
    }

    /// The day on the snapshot is the day it was written; a widget drawn on a later day
    /// must not say today's workout is done.
    var isToday: Bool {
        let f = DateFormatter(); f.dateFormat = "yyyy-MM-dd"; f.locale = Locale(identifier: "en_US_POSIX")
        return d == f.string(from: Date())
    }
}

extension Color {
    init(hex: String?) {
        var s = (hex ?? "#e1d4c2").trimmingCharacters(in: .whitespaces)
        if s.hasPrefix("#") { s.removeFirst() }
        var v: UInt64 = 0
        Scanner(string: s).scanHexInt64(&v)
        if s.count != 6 { v = 0xA3E635 }
        self.init(red: Double((v >> 16) & 0xFF) / 255, green: Double((v >> 8) & 0xFF) / 255, blue: Double(v & 0xFF) / 255)
    }
}

struct LiftEntry: TimelineEntry {
    let date: Date
    let snap: LiftSnap?
}

struct LiftProvider: TimelineProvider {
    func placeholder(in context: Context) -> LiftEntry { LiftEntry(date: Date(), snap: nil) }
    func getSnapshot(in context: Context, completion: @escaping (LiftEntry) -> Void) {
        completion(LiftEntry(date: Date(), snap: LiftSnap.load()))
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<LiftEntry>) -> Void) {
        let now = Date()
        let next = Calendar.current.date(byAdding: .minute, value: 30, to: now) ?? now.addingTimeInterval(1800)
        completion(Timeline(entries: [LiftEntry(date: now, snap: LiftSnap.load())], policy: .after(next)))
    }
}

/// A ring of how much of the week's goal is done.
struct WeekRing: View {
    var n: Int
    var goal: Int
    var accent: Color
    var line: CGFloat = 9

    var body: some View {
        let frac = goal > 0 ? min(1, Double(n) / Double(goal)) : (n > 0 ? 1 : 0)
        ZStack {
            Circle().stroke(Color.white.opacity(0.12), lineWidth: line)
            Circle().trim(from: 0, to: CGFloat(max(0.001, frac)))
                .stroke(accent, style: StrokeStyle(lineWidth: line, lineCap: .round))
                .rotationEffect(.degrees(-90))
            VStack(spacing: 0) {
                Text(goal > 0 ? "\(n)/\(goal)" : "\(n)").font(.system(size: 22, weight: .heavy, design: .rounded)).minimumScaleFactor(0.6)
                Text("this week").font(.system(size: 9, weight: .semibold)).foregroundColor(.white.opacity(0.6))
            }.foregroundColor(.white)
        }
    }
}

struct WeekDays: View {
    var days: [Int]
    var accent: Color
    var body: some View {
        HStack(spacing: 5) {
            ForEach(0..<7, id: \.self) { i in
                let st = i < days.count ? days[i] : 0
                VStack(spacing: 3) {
                    RoundedRectangle(cornerRadius: 6)
                        .fill(st == 1 ? accent : Color.white.opacity(0.1))
                        .overlay(RoundedRectangle(cornerRadius: 6).stroke(st == 2 ? Color.white.opacity(0.3) : .clear, lineWidth: 1.5))
                        .frame(height: 24)
                    Text(String(Array("MTWTFSS")[i])).font(.system(size: 9, weight: .semibold)).foregroundColor(.white.opacity(0.55))
                }
            }
        }
    }
}

extension View {
    func liftBackground() -> some View {
        if #available(iOS 17.0, *) {
            return AnyView(self.containerBackground(for: .widget) { Color(red: 0.05, green: 0.05, blue: 0.06) })
        }
        return AnyView(self.padding().background(Color(red: 0.05, green: 0.05, blue: 0.06)))
    }
}
