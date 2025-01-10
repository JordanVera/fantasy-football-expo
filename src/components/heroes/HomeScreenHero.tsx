import React from 'react';
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
    (total: number, user: User) => total + (user?.bullets ?? 0),
    0
  );

  const totalActiveUsers = users?.reduce((total: number, user: User) => {
    if (user?.bullets && user.bullets > 0) {
      return total + 1;
    }
    return total;
  }, 0);

  const VIG = 10;
  const currentWeek = getStartingWeek() + 1;

  return (
    <View className="w-full gap-4 p-5 bg-black border border-gray-700 rounded-lg">
      <Text className="text-2xl font-bold text-white ">
        Welcome, {user?.username || 'User'}!
      </Text>

      <Text className="text-base text-white">
        <Text className="font-bold text-emerald-500">{totalActiveUsers}</Text>{' '}
        Active Users
      </Text>

      <Text className="text-base text-white">
        <Text className="font-bold text-emerald-500">{totalUserBullets}</Text>{' '}
        Total Entries
      </Text>

      <Text className="text-base text-white">
        <Text className="font-bold text-emerald-500">
          ${totalUserBullets * (Number(BUYIN_PRICE) - VIG)}
        </Text>{' '}
        Prize Pool
      </Text>

      <Text className="text-base text-left text-white ">
        Please make sure to read the rules!
      </Text>

      <View className="p-3 mt-2 bg-red-900 rounded">
        <Text className="text-sm text-red-200">
          It is currently week <Text className="font-bold">{currentWeek}</Text>.
          Please note you must make your picks on Thursday before 6pm CST (7pm
          EST) for week {currentWeek}.
          <Text className="font-bold">
            {' '}
            Even if you are not picking the Thursday game
          </Text>
          .
        </Text>
      </View>
    </View>
  );
}
