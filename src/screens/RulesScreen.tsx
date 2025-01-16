import { SafeAreaView, View, Text, ScrollView, Image } from 'react-native';
import RULES from '../types/RULES';

export function RulesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-4">
        {/* bg-gradient-to-br from-red-500 to-orange-600 */}
        <View className="items-center pt-6 ">
          <Image
            source={require('../media/logo.png')}
            className="!w-20 !h-20"
          />
          <Text className="text-3xl font-bold text-center text-white">
            NFL Last Longer Rules
          </Text>
          {/* Logo component would go here */}
        </View>

        <View className="py-6">
          {RULES.map((rule, index) => (
            <View key={index} className="flex-row mb-4">
              <Text className="mr-2 text-red-500">•</Text>
              <Text className="flex-1 text-white">{rule}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
