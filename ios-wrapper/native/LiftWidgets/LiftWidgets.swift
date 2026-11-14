import SwiftUI
import WidgetKit
#if canImport(ActivityKit)
import ActivityKit
#endif

// MARK: Today

struct TodayView: View {
    @Environment(\.widgetFamily) var family
    var entry: LiftEntry

    var body: some View {
        let snap = entry.snap
        let accent = Color(hex: snap?.accent)
        let t = snap?.isToday == true ? snap?.today : nil
        switch family {
        case .accessoryInline:
            Text(t == nil ? "Open Lift" : (t!.rest == true ? "Rest day" : (t!.done ? "Trained today" : t!.name)))
        case .accessoryRectangular:
            VStack(alignment: .leading, spacing: 1) {
                Text(t?.done == true ? "TRAINED" : "TODAY").font(.system(size: 10, weight: .bold))
                Text(t == nil ? "Open Lift" : (t!.rest == true ? "Rest day" : t!.name)).font(.system(size: 14, weight: .bold)).lineLimit(2)
            }.frame(maxWidth: .infinity, alignment: .leading)
        default:
            VStack(alignment: .leading, spacing: 6) {
                Text(t?.done == true ? "TRAINED" : "TODAY").font(.system(size: 11, weight: .bold)).foregroundColor(accent)
                Text(t == nil ? "Open Lift" : (t!.rest == true ? "Rest day" : t!.name)).font(.system(size: family == .systemSmall ? 20 : 26, weight: .heavy)).lineLimit(2).minimumScaleFactor(0.7)
                if let sub = t?.sub, !sub.isEmpty, t?.rest != true {
                    Text(sub).font(.system(size: 12)).foregroundColor(.white.opacity(0.6)).lineLimit(2)
                }
                Spacer(minLength: 0)
                if let w = snap?.week, family != .systemSmall { WeekDays(days: w.days, accent: accent) }
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            .liftBackground()
        }
    }
}

struct TodayWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "LiftToday", provider: LiftProvider()) { entry in TodayView(entry: entry) }
            .configurationDisplayName("Today")
            .description("Today's workout and whether you have trained.")
            .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular, .accessoryInline])
    }
}

// MARK: Week

struct WeekView: View {
    @Environment(\.widgetFamily) var family
    var entry: LiftEntry

    var body: some View {
        let accent = Color(hex: entry.snap?.accent)
        let w = entry.snap?.week
        switch family {
        case .accessoryCircular:
            WeekRing(n: w?.n ?? 0, goal: w?.goal ?? 0, accent: .white, line: 5)
        case .systemMedium:
            HStack(spacing: 16) {
                WeekRing(n: w?.n ?? 0, goal: w?.goal ?? 0, accent: accent, line: 10).frame(width: 110, height: 110)
                VStack(alignment: .leading, spacing: 8) {
                    Text("THIS WEEK").font(.system(size: 11, weight: .bold)).foregroundColor(accent)
                    WeekDays(days: w?.days ?? [], accent: accent)
                }
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .liftBackground()
        default:
            WeekRing(n: w?.n ?? 0, goal: w?.goal ?? 0, accent: accent)
                .padding(4)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .liftBackground()
        }
    }
}

struct WeekWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "LiftWeek", provider: LiftProvider()) { entry in WeekView(entry: entry) }
            .configurationDisplayName("Week")
            .description("The weekly goal ring and the days you trained.")
            .supportedFamilies([.systemSmall, .systemMedium, .accessoryCircular])
    }
}

// MARK: Streak and badge

struct StreakView: View {
    @Environment(\.widgetFamily) var family
    var entry: LiftEntry

    var body: some View {
        let accent = Color(hex: entry.snap?.accent)
        let streak = entry.snap?.streak ?? 0
        let badge = entry.snap?.badge
        switch family {
        case .accessoryRectangular:
            VStack(alignment: .leading, spacing: 1) {
                Text("\(streak) \(streak == 1 ? "week" : "weeks") on goal").font(.system(size: 14, weight: .bold))
                if let b = badge { Text(b.name).font(.system(size: 11)).lineLimit(1) }
            }.frame(maxWidth: .infinity, alignment: .leading)
        default:
            VStack(alignment: .leading, spacing: 6) {
                Text("STREAK").font(.system(size: 11, weight: .bold)).foregroundColor(accent)
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text("\(streak)").font(.system(size: 44, weight: .heavy, design: .rounded))
                    Text(streak == 1 ? "week on goal" : "weeks on goal").font(.system(size: 12, weight: .semibold)).foregroundColor(.white.opacity(0.6))
                }
                Spacer(minLength: 0)
                if let b = badge {
                    Text("LATEST BADGE").font(.system(size: 9, weight: .bold)).foregroundColor(.white.opacity(0.5))
                    Text(b.name).font(.system(size: 15, weight: .bold)).lineLimit(1).minimumScaleFactor(0.7)
                }
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            .liftBackground()
        }
    }
}

struct StreakWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "LiftStreak", provider: LiftProvider()) { entry in StreakView(entry: entry) }
            .configurationDisplayName("Streak")
            .description("Weeks in a row on goal and the latest badge you won.")
            .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular])
    }
}

// MARK: Rest, as a Live Activity

#if canImport(ActivityKit)
@available(iOS 16.1, *)
struct RestLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: LiftRestAttributes.self) { context in
            let accent = Color(hex: context.attributes.accent)
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("REST").font(.system(size: 11, weight: .bold)).foregroundColor(accent)
                    if !context.state.next.isEmpty { Text("Next: \(context.state.next)").font(.system(size: 13)).foregroundColor(.white.opacity(0.7)).lineLimit(1) }
                }
                Spacer()
                Text(timerInterval: Date()...max(Date(), context.state.end), countsDown: true)
                    .font(.system(size: 34, weight: .heavy, design: .rounded)).monospacedDigit().foregroundColor(.white)
                    .multilineTextAlignment(.trailing).frame(maxWidth: 110, alignment: .trailing)
            }
            .padding(16)
            .activityBackgroundTint(Color(red: 0.05, green: 0.05, blue: 0.06))
        } dynamicIsland: { context in
            let accent = Color(hex: context.attributes.accent)
            return DynamicIsland {
                DynamicIslandExpandedRegion(.leading) { Text("REST").font(.system(size: 12, weight: .bold)).foregroundColor(accent) }
                DynamicIslandExpandedRegion(.trailing) {
                    Text(timerInterval: Date()...max(Date(), context.state.end), countsDown: true).monospacedDigit().frame(maxWidth: 80)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    if !context.state.next.isEmpty { Text("Next: \(context.state.next)").font(.system(size: 13)).lineLimit(1) }
                }
            } compactLeading: {
                Text("REST").font(.system(size: 10, weight: .bold)).foregroundColor(accent)
            } compactTrailing: {
                Text(timerInterval: Date()...max(Date(), context.state.end), countsDown: true).monospacedDigit().frame(maxWidth: 44)
            } minimal: {
                Image(systemName: "timer").foregroundColor(accent)
            }
        }
    }
}
#endif

@main
struct LiftWidgetBundle: WidgetBundle {
    var body: some Widget {
        TodayWidget()
        WeekWidget()
        StreakWidget()
        if #available(iOS 16.1, *) { RestLiveActivity() }
    }
}
