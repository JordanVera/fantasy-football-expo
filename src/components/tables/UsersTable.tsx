import { ScrollView, Text, View, Dimensions } from 'react-native';
import { Table, Row, Rows } from 'react-native-reanimated-table';
import { useUsers } from '@/src/hooks/useUsers';
import type Pick from '@/src/types/Pick';
import { NUMBER_OF_WEEKS } from '@env';

// Define interface for the grouped picks structure
interface GroupedPicks {
  [entryNumber: number]: {
    [week: number]: Pick;
  };
}

export default function UsersTable() {
  const { users } = useUsers();

  // Create table header
  const tableHead = [
    'Username',
    ...[...Array(Number(NUMBER_OF_WEEKS))].map((_, i) => `Week ${i + 1}`),
  ];

  // Create table data
  const tableData =
    users?.flatMap((user) => {
      const groupedPicks = user.Picks.reduce<GroupedPicks>((grouped, pick) => {
        if (!grouped[pick.entryNumber]) {
          grouped[pick.entryNumber] = {};
        }
        grouped[pick.entryNumber][pick.week] = pick;
        return grouped;
      }, {});

      return [...Array(user.bullets || 0)].map((_, index) => {
        const userName = `${user.username} (${index + 1})`;
        const weekPicks = [...Array(Number(NUMBER_OF_WEEKS))].map(
          (_, weekIndex) => groupedPicks[index]?.[weekIndex + 1]?.team || ''
        );

        return [userName, ...weekPicks];
      });
    }) || [];

  return (
    <View className="w-full">
      <ScrollView horizontal className="w-full">
        <ScrollView>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#404040' }}>
            <Row
              data={tableHead}
              style={{ backgroundColor: '#111827' }}
              textStyle={{
                color: 'white',
                fontSize: 12,
                fontWeight: '500',
                textAlign: 'center',
              }}
              widthArr={[
                192,
                ...[...Array(Number(NUMBER_OF_WEEKS))].map(() => 96),
              ]}
            />
            <Rows
              data={tableData}
              style={{ backgroundColor: '#111827' }}
              textStyle={{
                color: 'white',
                fontSize: 14,
                textAlign: 'center',
                padding: 10,
              }}
              widthArr={[
                192,
                ...[...Array(Number(NUMBER_OF_WEEKS))].map(() => 96),
              ]}
            />
          </Table>
        </ScrollView>
      </ScrollView>
    </View>
  );
}
