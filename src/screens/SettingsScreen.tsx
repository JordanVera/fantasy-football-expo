import React from 'react';
import { View, Text, Switch } from 'react-native';

export function SettingsScreen() {
  return (
    <View className="flex-1 p-4 bg-white dark:bg-gray-900">
      <View className="flex-row items-center justify-between py-3 border-b border-gray-300">
        <Text className="text-base text-black dark:text-white">Dark Mode</Text>
        {/* <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={theme === 'dark' ? '#f5dd4b' : '#f4f3f4'}
        /> */}
      </View>
    </View>
  );
}
