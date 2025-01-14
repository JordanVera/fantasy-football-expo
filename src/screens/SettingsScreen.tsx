import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

export function SettingsScreen() {
  const { user, logout } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          onPress={logout}
          className="flex-row items-center gap-2 px-6 py-3 bg-red-500 rounded-lg"
        >
          <Text className="font-semibold text-white">Logout</Text>
          <MaterialIcons name="logout" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
