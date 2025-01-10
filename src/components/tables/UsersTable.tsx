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

  // Keep the display 1-based for users
  const tableHead = [
    'Username',
    ...[...Array(Number(NUMBER_OF_WEEKS))].map((_, i) => `Week ${i + 1}`),
  ];

  // Add console.log to check losers data
  // console.log('Losers data:', losers);

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
        const rowStyle = [
          {
            color: '#ffffff',
            textAlign: 'center',
            fontSize: 14,
            padding: 10,
          },
        ];

        [...Array(Number(NUMBER_OF_WEEKS))].forEach((_, weekIndex) => {
          const pick = groupedPicks?.[index]?.[weekIndex]?.team || '';
          rowData.push(pick);

          const isLoser = losers?.some(
            (loser) => loser.week === weekIndex && loser.team === pick
          );

          rowStyle.push({
            color: isLoser ? '#ef4444' : '#ffffff',
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
              data={tableHead.map((header, index) => (
                <Text
                  key={`header-${index}`}
                  style={{
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: '500',
                    textAlign: 'center',
                    padding: 10,
                    width: index === 0 ? 192 : 96,
                  }}
                >
                  {header}
                </Text>
              ))}
              style={{ backgroundColor: '#111827', height: 40 }}
            />
            {tableData.map((rowData, rowIndex) => (
              <Row
                key={rowIndex}
                data={rowData.map((cellData, cellIndex) => (
                  <Text
                    key={`${rowIndex}-${cellIndex}`}
                    style={[
                      rowStyles[rowIndex][cellIndex],
                      { width: cellIndex === 0 ? 192 : 96 },
                    ]}
                  >
                    {cellData}
                  </Text>
                ))}
                style={{ backgroundColor: '#111827', height: 40 }}
              />
            ))}
          </Table>
        </ScrollView>
      </ScrollView>
    </View>
  );
}
