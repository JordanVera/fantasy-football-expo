import { useState } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
} from 'react-native';

import { CheckoutActionSheet } from '@/src/components/actionsheets/CheckoutActionSheet';
import MakePicksActionSheet from '@/src/components/actionsheets/MakePicksActionSheet';
import UsersTable from '@/src/components/tables/UsersTable';
import TeamAvailabilityTable from '@/src/components/tables/TeamAvailabilityTable';
import { HomeScreenHero } from '../components/heroes/HomeScreenHero';
import { CreditCardIcon } from 'lucide-react-native';
import { Icon } from '@/src/components/ui/icon';
import { Button, ButtonText } from '@/src/components/ui/button';

export function HomeScreen() {
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 w-full bg-black">
      <ScrollView className="flex-1 w-full">
        <View className="items-center justify-center w-full gap-5 p-4">
          <HomeScreenHero />
          <View className="flex flex-row items-center w-full gap-5">
            <MakePicksActionSheet />

            <Button
              onPress={() => setIsCheckoutModalVisible(true)}
              className="flex-1 bg-indigo-500"
            >
              <ButtonText>Checkout</ButtonText>
              <Icon as={CreditCardIcon} className="text-white" size={'md'} />
            </Button>
          </View>
          <TeamAvailabilityTable />

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
