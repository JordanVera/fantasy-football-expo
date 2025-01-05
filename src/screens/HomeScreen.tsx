import { View, Text, TouchableOpacity } from 'react-native';
import { api } from '../services/ApiService';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function HomeScreen() {
  const [testResult, setTestResult] = useState<string>('');
  const { user, logout } = useAuth();

  const handleTestPress = async () => {
    try {
      const result = await api.test();
      setTestResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setTestResult('Error: ' + (error as Error).message);
    }
  };

  return (
    <View className="items-center justify-center flex-1 w-full bg-gray-900">
      <Text className="mb-4 text-2xl text-white">
        Welcome, {user?.name || 'User'}!
      </Text>
      <Text className="mb-8 text-white">{user?.email}</Text>

      <TouchableOpacity
        onPress={handleTestPress}
        className="px-6 py-3 mb-4 bg-blue-500 rounded-lg"
      >
        <Text className="font-semibold text-white">Test API</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={logout}
        className="px-6 py-3 bg-red-500 rounded-lg"
      >
        <Text className="font-semibold text-white">Logout</Text>
      </TouchableOpacity>

      {testResult ? (
        <Text className="p-4 mt-4 text-white bg-gray-800 rounded">
          {testResult}
        </Text>
      ) : null}
    </View>
  );
}
