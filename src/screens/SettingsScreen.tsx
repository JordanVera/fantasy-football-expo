import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
// import {
//   registerWeeklyNotification,
//   registerForPushNotifications,
// } from '../utils/notifications';
import * as Notifications from 'expo-notifications';
import { api } from '../services/ApiService';
import { Button, ButtonText } from '../components/ui/button';

export function SettingsScreen() {
  const { user, logout } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [pickReminders, setPickReminders] = useState(true);

  // const handlePushToggle = async (value: boolean) => {
  //   setPushNotifications(value);
  //   if (value) {
  //     try {
  //       // Check current permission status
  //       const { status } = await Notifications.getPermissionsAsync();
  //       console.log('Current permission status:', status);

  //       // Get the push token
  //       const token = await registerForPushNotifications();
  //       console.log('Received push token:', token);

  //       if (token && user?.id) {
  //         // Save the token to the database
  //         console.log('Attempting to save token for user:', user.id);
  //         const result = await api.updatePushToken(user.id, token);
  //         console.log('Save token result:', result);
  //       } else {
  //         console.log('Missing token or user ID:', { token, userId: user?.id });
  //       }
  //       await registerWeeklyNotification();
  //     } catch (error) {
  //       console.error('Error in handlePushToggle:', error);
  //     }
  //   } else {
  //     await api.removePushToken(user?.id);
  //     await Notifications.cancelAllScheduledNotificationsAsync();
  //   }
  // };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView>
        {/* Account Section */}
        <View className="p-4 border-b border-gray-700">
          <Text className="mb-4 text-lg font-bold text-white">Account</Text>
          <View className="mb-4">
            <Text className="text-gray-400">Username</Text>
            <Text className="text-white">{user?.username}</Text>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-gray-400">Email</Text>
              <Text className="text-white">{user?.email}</Text>
            </View>
            <Button className="bg-zinc-700">
              <ButtonText>Update</ButtonText>
            </Button>
          </View>
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-gray-400">Password</Text>
              <Text className="text-white">********</Text>
            </View>
            <Button className="bg-zinc-700">
              <ButtonText>Update</ButtonText>
            </Button>
          </View>

          <View className="mb-4">
            <Text className="text-gray-400">Active Entries</Text>
            <Text className="text-white">{user?.bullets || 0}</Text>
          </View>
        </View>

        {/* Notifications Section */}
        <View className="p-4 border-b border-gray-700">
          <Text className="mb-4 text-lg font-bold text-white">
            Notifications
          </Text>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white">Push Notifications</Text>
            <Switch
              value={pushNotifications}
              // onValueChange={handlePushToggle}
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-white">Pick Reminders</Text>
            <Switch value={pickReminders} onValueChange={setPickReminders} />
          </View>
        </View>

        {/* Logout Button */}
        <View className="p-4">
          <TouchableOpacity
            onPress={logout}
            className="flex-row items-center justify-center gap-2 px-6 py-3 bg-red-500 rounded-lg"
          >
            <Text className="font-semibold text-white">Logout</Text>
            <MaterialIcons name="logout" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
