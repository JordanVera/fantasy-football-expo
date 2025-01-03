import { View, Text, TouchableOpacity } from 'react-native';
import { api } from '../services/ApiService';

export function LoginScreen() {
  const handleTestApi = async () => {
    try {
      const response = await api.test();
      console.log('API Test Response:', response);
    } catch (error) {
      console.error('API Test Error:', error);
    }
  };

  return (
    <View className="items-center justify-center flex-1">
      <Text className="mb-4 text-xl">Login Screen</Text>

      <TouchableOpacity
        className="px-6 py-3 bg-blue-500 rounded-lg"
        onPress={handleTestApi}
      >
        <Text className="font-semibold text-white">Test API</Text>
      </TouchableOpacity>
    </View>
  );
}
