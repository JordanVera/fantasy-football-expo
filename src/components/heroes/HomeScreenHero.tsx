import { View, Text } from 'react-native';
import { useUsers } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import User from '../../types/User';
import { BUYIN_PRICE } from '@env';
import { getStartingWeek } from '../../utils/dates';

export function HomeScreenHero() {
  const { users } = useUsers();
  const { user } = useAuth();

  const totalUserBullets = users?.reduce(
    (total: number, user: User) => total + user?.bullets,
    0
  );

  const totalActiveUsers = users?.reduce((total: number, user: User) => {
    if (user?.bullets) {
      return total + 1;
    }
    return total;
  }, 0);

  const VIG = 10;

  return (
    <View className="flex w-full gap-5 p-5 bg-gray-900 border border-gray-700 rounded-lg">
      <Text className="text-2xl text-left text-white">
        Welcome, {user?.username || 'User'}!
      </Text>
      <Text className="w-full text-lg font-bold text-white">
        There is a total of {totalActiveUsers} users with {totalUserBullets}{' '}
        entries which makes the prize pool $
        {totalUserBullets * (Number(BUYIN_PRICE) - VIG)}
      </Text>

      <Text className="text-sm text-orange-700">
        ***
        <Text className="font-bold">
          It is currently week {getStartingWeek() + 1}.
        </Text>{' '}
        Please note you must make your picks on Thursday before 6pm CST (7pm
        EST) for week {getStartingWeek() + 1}.{' '}
        <Text className="font-bold">
          Even if you are not picking the thursday game
        </Text>
        .***
      </Text>
    </View>
  );
}
