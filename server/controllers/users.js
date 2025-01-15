import { PrismaClient } from '@prisma/client';
import { Expo } from 'expo-server-sdk';
import { getStartingWeek } from '../utils/dates.js';
import cron from 'node-cron';

const prisma = new PrismaClient();
const expo = new Expo();

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        bullets: true,
        Picks: {
          select: {
            week: true,
            team: true,
            entryNumber: true,
          },
          orderBy: [{ week: 'asc' }, { entryNumber: 'asc' }],
        },
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUser = async (req, res) => {
  const userId = Number(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        bullets: true,
        email: true,
        pushNotifications: true,
        pickReminders: true,
        Picks: {
          select: {
            id: true,
            week: true,
            team: true,
            entryNumber: true,
          },
          orderBy: [{ week: 'asc' }, { entryNumber: 'asc' }],
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// // Update user's push token
// export const updatePushToken = async (req, res) => {
//   const { userId, pushToken } = req.body;

//   try {
//     await prisma.user.update({
//       where: { id: userId },
//       data: { pushToken },
//     });

//     res.status(200).json({ message: 'Push token updated successfully' });
//   } catch (error) {
//     console.error('Error updating push token:', error);
//     res.status(500).json({ error: 'Failed to update push token' });
//   }
// };

// // Remove user's push token
// export const removePushToken = async (req, res) => {
//   const { userId } = req.body;

//   try {
//     await prisma.user.update({
//       where: { id: userId },
//       data: { pushToken: null },
//     });

//     res.status(200).json({ message: 'Push token removed successfully' });
//   } catch (error) {
//     console.error('Error removing push token:', error);
//     res.status(500).json({ error: 'Failed to remove push token' });
//   }
// };

// // Send notifications to all users
// export const sendPickReminders = async () => {
//   try {
//     const currentWeek = getStartingWeek();

//     // Get all users with push tokens
//     const users = await prisma.user.findMany({
//       where: {
//         pushToken: { not: null },
//         active: true,
//       },
//     });

//     // Prepare messages
//     const messages = users.map((user) => ({
//       to: user.pushToken,
//       sound: 'default',
//       title: 'NFL Last Longer Reminder',
//       body: `Don't forget to make your picks for Week ${currentWeek}! Deadline is today at 6pm CST.`,
//       data: { screen: 'Home' },
//     }));

//     // Filter out invalid tokens
//     const validMessages = messages.filter((message) =>
//       Expo.isExpoPushToken(message.to)
//     );

//     // Send notifications in chunks
//     const chunks = expo.chunkPushNotifications(validMessages);

//     for (let chunk of chunks) {
//       try {
//         await expo.sendPushNotificationsAsync(chunk);
//       } catch (error) {
//         console.error('Error sending notifications:', error);
//       }
//     }
//   } catch (error) {
//     console.error('Error in sendPickReminders:', error);
//   }
// };

// export const sendTestNotification = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Get user with their push token
//     const user = await prisma.user.findUnique({
//       where: { id: Number(userId) },
//       select: { pushToken: true },
//     });

//     if (!user?.pushToken) {
//       return res.status(400).json({ error: 'No push token found for user' });
//     }

//     // Prepare the message
//     const message = {
//       to: user.pushToken,
//       sound: 'default',
//       title: 'Test Notification',
//       body: 'This is a test notification!',
//       data: { screen: 'Home' },
//     };

//     // Validate the token
//     if (!Expo.isExpoPushToken(message.to)) {
//       return res.status(400).json({ error: 'Invalid push token' });
//     }

//     // Send the notification
//     const chunks = expo.chunkPushNotifications([message]);
//     const tickets = [];

//     for (let chunk of chunks) {
//       try {
//         const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//         tickets.push(...ticketChunk);
//         console.log('Notification sent:', ticketChunk);
//       } catch (error) {
//         console.error('Error sending notification:', error);
//       }
//     }

//     res.status(200).json({ message: 'Test notification sent', tickets });
//   } catch (error) {
//     console.error('Error in sendTestNotification:', error);
//     res.status(500).json({ error: 'Failed to send test notification' });
//   }
// };

// // Schedule the notification task
// cron.schedule(
//   '0 10 * * 4',
//   () => {
//     sendPickReminders();
//   },
//   {
//     timezone: 'America/Chicago',
//   }
// );
