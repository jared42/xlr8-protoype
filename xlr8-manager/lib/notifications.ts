import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('runway', {
      name: 'Supply runway',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return true;
}

// Schedule (or replace) a reminder N days before reorder is due.
// Call this whenever cadence or lastShipmentDate changes.
export async function scheduleRunwayReminder(
  daysUntilReorder: number,
  reminderDaysAhead = 7,
) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const triggerDays = daysUntilReorder - reminderDaysAhead;
  if (triggerDays <= 0) return; // already overdue, don't schedule

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'XLR8 — Reorder coming up',
      body: `Your next research-supply shipment is due in ${reminderDaysAhead} days. Tap to reorder at the store.`,
      data: { type: 'runway' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: triggerDays * 24 * 60 * 60,
    },
  });
}
