import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import MakePicksActionSheet from '@/src/components/actionsheets/MakePicksActionSheet';
import UsersTable from '@/src/components/tables/UsersTable';
import TeamAvailabilityTable from '@/src/components/tables/TeamAvailabilityTable';
import { HomeScreenHero } from '../components/heroes/HomeScreenHero';

export function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 w-full bg-black">
      <ScrollView className="flex-1 w-full px-4">
        <View className="items-center justify-center w-full gap-5">
          <View className="flex-row justify-center w-full gap-5">
            <MakePicksActionSheet />
            <TouchableOpacity
              onPress={logout}
              className="px-6 py-3 bg-purple-500 rounded-lg"
            >
              <Text className="font-semibold text-white">Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={logout}
              className="px-6 py-3 bg-red-500 rounded-lg"
            >
              <Text className="font-semibold text-white">Logout</Text>
            </TouchableOpacity>
          </View>

          <HomeScreenHero />
          <TeamAvailabilityTable />
          <UsersTable />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
