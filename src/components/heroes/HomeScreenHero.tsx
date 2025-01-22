import { useEffect, useState } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { useUsers } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import User from '../../types/User';
import { BUYIN_PRICE } from '@env';
import { api } from '@/src/services/ApiService';

export function HomeScreenHero() {
  const { users, getTotalActiveEntries } = useUsers();
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [randomImage, setRandomImage] = useState<any>(null);

  const backgroundImages = [
    require('../../media/jettas.jpeg'),
    require('../../media/mahomes.jpg'),
    require('../../media/bigTruss.jpg'),
    require('../../media/obj.jpg'),
    require('../../media/ocho.jpg'),
    require('../../media/ar12.jpg'),
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setRandomImage(backgroundImages[randomIndex]);
  }, []);

  useEffect(() => {
    const fetchCurrentWeek = async () => {
      const week = await api.getStartingWeek();
      setCurrentWeek(week);
    };

    fetchCurrentWeek();
  }, []);

  useEffect(() => {
    console.log('TOTAL ACTIVE ENTRIES');
    console.log(getTotalActiveEntries());
  }, [getTotalActiveEntries]);

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

  return (
    <ImageBackground
      source={randomImage}
      className="object-cover w-full overflow-hidden rounded-lg object"
      // imageStyle={{}}
    >
      <View className="w-full gap-4 p-5 bg-black/70">
        <Text className="text-2xl font-bold text-white ">
          Welcome, {user?.username || 'User'}!
        </Text>

        <Text className="text-base text-white">
          <Text className="font-bold text-emerald-500">{totalActiveUsers}</Text>{' '}
          Users
        </Text>

        <Text className="text-base text-white">
          <Text className="font-bold text-emerald-500">{totalUserBullets}</Text>{' '}
          Entries
        </Text>

        <Text className="text-base text-white">
          <Text className="font-bold text-emerald-500">
            {getTotalActiveEntries()}
          </Text>{' '}
          Active Entries
        </Text>

        <Text className="text-base text-white">
          <Text className="font-bold text-emerald-500">
            ${totalUserBullets * (Number(BUYIN_PRICE) - VIG)}
          </Text>{' '}
          Prize Pool
        </Text>

        <Text className="text-base font-bold text-left text-white">
          Please make sure to read the rules!
        </Text>

        <View className="p-3 mt-2 rounded bg-red-900/90">
          <Text className="text-sm text-red-200">
            It is currently week{' '}
            <Text className="font-bold">{currentWeek}</Text>. Please note you
            must make your picks on Thursday before 6pm CST (7pm EST) for week{' '}
            {currentWeek}.
            <Text className="font-bold">
              {' '}
              Even if you are not picking the Thursday game
            </Text>
            .
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
