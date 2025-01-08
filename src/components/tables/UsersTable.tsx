import { ScrollView, Text, View, Dimensions } from 'react-native';
import { Table, Row, Rows } from 'react-native-reanimated-table';
import { useUsers } from '@/src/context/UserContext';
import type Pick from '@/src/types/Pick';
import { NUMBER_OF_WEEKS } from '@env';

// Define interface for the grouped picks structure
interface GroupedPicks {
  [entryNumber: number]: {
    [week: number]: Pick;
  };
}

export default function UsersTable() {
  const { users, loadingUsers, losers } = useUsers();

  // Create table header
  const tableHead = [
    'Username',
    ...[...Array(Number(NUMBER_OF_WEEKS))].map((_, i) => `Week ${i + 1}`),
  ];

  // Create table data and styles together
  const { tableData, rowStyles } = users?.reduce(
    (acc, user) => {
      const groupedPicks = user.Picks?.reduce<GroupedPicks>((grouped, pick) => {
        if (!grouped[pick.entryNumber]) {
          grouped[pick.entryNumber] = {};
        }
        grouped[pick.entryNumber][pick.week] = pick;
        return grouped;
      }, {});

      [...Array(user.bullets || 0)].forEach((_, index) => {
        const userName = `${user.username} (${index + 1})`;
        const rowData = [userName];
        const rowStyle = [{ color: 'white' }]; // Style for username

        // Add picks and their styles
        [...Array(Number(NUMBER_OF_WEEKS))].forEach((_, weekIndex) => {
          const pick = groupedPicks?.[index]?.[weekIndex + 1]?.team || '';
          rowData.push(pick);

          const isLoser = losers?.some(
            (loser) => loser.week === weekIndex + 1 && loser.team === pick
          );

          console.log(isLoser);

          rowStyle.push({
            color: isLoser ? '#ef4444' : '#fff',
            textAlign: 'center',
            fontSize: 14,
            padding: 10,
          });
        });

        acc.tableData.push(rowData);
        acc.rowStyles.push(rowStyle);
      });

      return acc;
    },
    { tableData: [], rowStyles: [] } as {
      tableData: string[][];
      rowStyles: any[][];
    }
  ) || { tableData: [], rowStyles: [] };

  if (loadingUsers) {
    return <Text className="text-white">Loading...</Text>;
  }

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
            {tableData.map((rowData, index) => (
              <Row
                key={index}
                data={rowData}
                style={{ backgroundColor: '#111827' }}
                textStyle={rowStyles[index]}
                widthArr={[
                  192,
                  ...[...Array(Number(NUMBER_OF_WEEKS))].map(() => 96),
                ]}
              />
            ))}
          </Table>
        </ScrollView>
      </ScrollView>
    </View>
  );
}
