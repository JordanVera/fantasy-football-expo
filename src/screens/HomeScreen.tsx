import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import MakePicksActionSheet from '@/src/components/actionsheets/MakePicksActionSheet';
import UsersTable from '@/src/components/tables/UsersTable';
import TeamAvailabilityTable from '@/src/components/tables/TeamAvailabilityTable';
import { HomeScreenHero } from '../components/heroes/HomeScreenHero';

export function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 w-full bg-black">
      <ScrollView className="flex-1 w-full">
        <View className="items-center justify-center w-full gap-5 p-4">
          <HomeScreenHero />
          <TeamAvailabilityTable />
          <MakePicksActionSheet />
          <UsersTable />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
