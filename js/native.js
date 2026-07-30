'use strict';

/**
 * Destiny Matrix — native (Capacitor iOS wrapper) integration
 * ──────────────────────────────────────────────────────────
 * Every function here is a safe no-op on the regular website/PWA — it only
 * does anything once wrapped and running inside the native iOS app, where
 * window.Capacitor exists. Nothing in this file ever runs on
 * niko-999.github.io itself.
 *
 * DOB local storage: opting into the daily reminder (or the home-screen
 * widget) needs your birthdate available on-device without the app being
 * open, so it's saved via Capacitor Preferences (iOS UserDefaults) in an
 * App Group shared with the widget extension. Still never sent anywhere —
 * "on this device only" replaces "never saved" as the accurate privacy
 * claim for the native app specifically; the website is unaffected.
 *
 * API:
 *   DMNative.isNative()                 -> bool
 *   DMNative.haptic()                   -> light impact tap, no-op on web
 *   DMNative.share(title, url)          -> native share sheet, falls back
 *                                          to the caller's own web share path
 *   DMNative.isReminderEnabled()        -> Promise<bool>
 *   DMNative.enableDailyReminder(dobIso)-> Promise<void>
 *   DMNative.disableDailyReminder()     -> Promise<void>
 */
window.DMNative = (function () {
  const APP_GROUP = 'group.com.nikorapullin.destinymatrix';
  const DOB_KEY = 'dm-native-dob';
  const REMINDER_DAYS_AHEAD = 60;   // stay well under iOS's 64-pending-notification cap
  const REMINDER_HOUR = 9;          // 9am local
  const NOTIF_ID_BASE = 5000;

  function isNative() {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  }

  function haptic() {
    if (!isNative() || !window.Capacitor.Plugins.Haptics) return;
    try { window.Capacitor.Plugins.Haptics.impact({ style: 'LIGHT' }); } catch (_) {}
  }

  async function share(title, url) {
    if (!isNative() || !window.Capacitor.Plugins.Share) return false;
    try {
      await window.Capacitor.Plugins.Share.share({ title, url });
      return true;
    } catch (_) {
      return false; // user cancelled — caller shouldn't fall back further
    }
  }

  async function _prefs() {
    const { Preferences } = window.Capacitor.Plugins;
    try { await Preferences.configure({ group: APP_GROUP }); } catch (_) {} // no-op if unsupported
    return Preferences;
  }

  async function isReminderEnabled() {
    if (!isNative()) return false;
    const Preferences = await _prefs();
    const { value } = await Preferences.get({ key: DOB_KEY });
    return !!value;
  }

  function _scheduleForDob(dobIso) {
    const { LocalNotifications } = window.Capacitor.Plugins;
    if (!LocalNotifications || !window.DMEngine || !window.DDailyReminderContent) return;

    const notifications = [];
    const now = new Date();
    for (let i = 0; i < REMINDER_DAYS_AHEAD; i++) {
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, REMINDER_HOUR, 0, 0, 0);
      if (target <= now) continue;
      const iso = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
      const day = window.DMEngine.getPersonalDay(dobIso, iso);
      const body = window.DDailyReminderContent.get(day.value);
      if (!body) continue;
      notifications.push({
        id: NOTIF_ID_BASE + i,
        title: 'Destiny Matrix',
        body,
        schedule: { at: target },
      });
    }

    return LocalNotifications.cancel({
      notifications: Array.from({ length: REMINDER_DAYS_AHEAD }, (_, i) => ({ id: NOTIF_ID_BASE + i })),
    }).catch(() => {}).then(() => LocalNotifications.schedule({ notifications }));
  }

  async function enableDailyReminder(dobIso) {
    if (!isNative()) return;
    const { LocalNotifications } = window.Capacitor.Plugins;
    if (!LocalNotifications) return;

    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') return;

    const Preferences = await _prefs();
    await Preferences.set({ key: DOB_KEY, value: dobIso });
    await _scheduleForDob(dobIso);
  }

  async function disableDailyReminder() {
    if (!isNative()) return;
    const { LocalNotifications } = window.Capacitor.Plugins;
    const Preferences = await _prefs();
    await Preferences.remove({ key: DOB_KEY });
    if (LocalNotifications) {
      await LocalNotifications.cancel({
        notifications: Array.from({ length: REMINDER_DAYS_AHEAD }, (_, i) => ({ id: NOTIF_ID_BASE + i })),
      }).catch(() => {});
    }
  }

  // Top up the notification queue on every launch so it never runs dry —
  // harmless/no-op if the reminder was never enabled.
  async function _refreshIfEnabled() {
    if (!isNative()) return;
    const Preferences = await _prefs();
    const { value } = await Preferences.get({ key: DOB_KEY });
    if (value) await _scheduleForDob(value);
  }
  if (isNative()) {
    window.addEventListener('load', () => { _refreshIfEnabled(); });
  }

  return { isNative, haptic, share, isReminderEnabled, enableDailyReminder, disableDailyReminder };
})();
