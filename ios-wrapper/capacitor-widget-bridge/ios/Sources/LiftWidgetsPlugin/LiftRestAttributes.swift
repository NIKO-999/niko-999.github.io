import Foundation
#if canImport(ActivityKit)
import ActivityKit

/// The rest between sets, as a Live Activity. This file is compiled into the app
/// (through the plugin) and into the widget extension, so both sides agree on it.
@available(iOS 16.1, *)
public struct LiftRestAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        public var end: Date
        public var next: String
        public init(end: Date, next: String) { self.end = end; self.next = next }
    }
    public var title: String
    public var accent: String
    public init(title: String, accent: String) { self.title = title; self.accent = accent }
}
#endif
