import React from 'react';
import { SafeAreaView, View, Text, Switch } from 'react-native';

export function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-base text-gray-900 dark:text-white">
          Dark Mode
        </Text>
        {/* <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={theme === 'dark' ? '#f5dd4b' : '#f4f3f4'}
        /> */}
      </View>
    </SafeAreaView>
  );
}
