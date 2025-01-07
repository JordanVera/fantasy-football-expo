import { ScrollView, View, Text } from 'react-native';
import { useUsers } from '@/src/hooks/useUsers';
import { Box } from '@/src/components/ui/box';
import type Pick from '@/src/types/Pick';
import { NUMBER_OF_WEEKS } from '@env';

// Define interface for the grouped picks structure
interface GroupedPicks {
  [entryNumber: number]: {
    [week: number]: Pick;
  };
}

export default function UsersTable() {
  const { users } = useUsers(); // TODO: add loading state

  // if (loading) {
  //   return (
  //     <View className="items-center justify-center flex-1">
  //       <Text className="text-white">Loading...</Text>
  //     </View>
  //   );
  // }

  return (
    <ScrollView horizontal className="flex-1">
      <View className="min-w-full border border-gray-700 rounded-xl">
        <View className="flex-row bg-gray-900">
          <View className="w-48 px-6 py-3">
            <Text className="text-xs font-medium text-white">Name</Text>
          </View>
          {[...Array(Number(NUMBER_OF_WEEKS))].map((_, index) => (
            <View key={index} className="w-24 px-2 py-3">
              <Text className="text-xs font-medium text-center text-white">
                Week {index + 1}
              </Text>
            </View>
          ))}
        </View>

        <View className="divide-y divide-gray-700">
          {users?.map((user) => {
            const groupedPicks = user.Picks.reduce<GroupedPicks>(
              (grouped, pick) => {
                if (!grouped[pick.entryNumber]) {
                  grouped[pick.entryNumber] = {};
                }
                grouped[pick.entryNumber][pick.week] = pick;
                return grouped;
              },
              {}
            );

            return [...Array(user.bullets || 0)].map((_, index) => (
              <View
                key={`${user.id}-${index}`}
                className="flex-row bg-gray-900 border-b border-gray-700"
              >
                <View className="w-48 px-6 py-4">
                  <View className="flex-row items-center gap-3">
                    <View className="items-center justify-center w-8 h-8 bg-gray-700 rounded-full">
                      <Text className="text-xs text-white uppercase">
                        {user.firstname?.[0]}
                        {user.lastname?.[0]}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-white">
                        {user.username} ({index + 1})
                      </Text>
                    </View>
                  </View>
                </View>

                {[...Array(Number(NUMBER_OF_WEEKS))].map((_, weekIndex) => {
                  const pick = groupedPicks[index]?.[weekIndex + 1]?.team || '';
                  return (
                    <View
                      key={`${user.id}-${index}-${weekIndex}`}
                      className="w-24 px-2 py-4"
                    >
                      <Text className="text-sm font-medium text-center text-white">
                        {pick}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ));
          })}
        </View>
      </View>
    </ScrollView>
  );
}
