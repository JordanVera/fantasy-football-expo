import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import moment from 'moment';

const NOTIFICATION_TASK = 'THURSDAY_REMINDER';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Define the background task
TaskManager.defineTask(NOTIFICATION_TASK, async () => {
  const now = moment();
  const isThursday = now.day() === 4; // 0 is Sunday, 4 is Thursday
  const hour = now.hour();

  if (isThursday && hour === 10) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't forget your NFL picks!",
        body: 'Reminder: You must submit your picks by 6pm CST today, even if you are not picking the Thursday game.',
        data: { screen: 'Home' },
      },
      trigger: null, // Send immediately
    });
  }

  return BackgroundFetch.Result.NewData;
});

export async function registerWeeklyNotification() {
  try {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    // Register the background task
    await BackgroundFetch.registerTaskAsync(NOTIFICATION_TASK, {
      minimumInterval: 60 * 60, // Check every hour
      stopOnTerminate: false, // Continue after app restart
      startOnBoot: true, // Start after device reboot
    });
  } catch (error) {
    console.error('Error registering notification task:', error);
  }
}

export async function registerForPushNotifications() {
  try {
    // Request permission
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission not granted');
      return;
    }

    // For Expo Go, use getExpoPushTokenAsync WITHOUT any parameters
    const tokenData = await Notifications.getExpoPushTokenAsync({});
    console.log('Token data received:', tokenData);

    return tokenData.data;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}
