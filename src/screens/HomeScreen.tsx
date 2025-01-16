import { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { CheckoutActionSheet } from '@/src/components/actionsheets/CheckoutActionSheet';
import MakePicksActionSheet from '@/src/components/actionsheets/MakePicksActionSheet';
import UsersTable from '@/src/components/tables/UsersTable';
import TeamAvailabilityTable from '@/src/components/tables/TeamAvailabilityTable';
import { HomeScreenHero } from '../components/heroes/HomeScreenHero';

export function HomeScreen() {
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 w-full bg-black">
      <ScrollView className="flex-1 w-full">
        <View className="items-center justify-center w-full gap-5 p-4">
          <HomeScreenHero />
          <TeamAvailabilityTable />
          <View className="flex flex-row items-center w-full gap-5">
            <MakePicksActionSheet />

            <TouchableOpacity
              className="flex-1 p-2 rounded-md bg-primary bg-cyan-500"
              onPress={() => setIsCheckoutModalVisible(true)}
            >
              <Text className="text-center text-white">Checkout</Text>
            </TouchableOpacity>
          </View>

          <UsersTable />

          <CheckoutActionSheet
            isOpen={isCheckoutModalVisible}
            onClose={() => setIsCheckoutModalVisible(false)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
