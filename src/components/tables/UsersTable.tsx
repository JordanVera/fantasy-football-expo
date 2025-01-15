import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableData,
  TableRow,
} from '@/src/components/ui/table';
import { useUsers } from '@/src/context/UserContext';
import { NUMBER_OF_WEEKS } from '@env';
import { ScrollView, Text, View } from 'react-native';
import type Pick from '@/src/types/Pick';

// Define interface for the grouped picks structure
interface GroupedPicks {
  [entryNumber: number]: {
    [week: number]: Pick;
  };
}

export default function NewTable() {
  const { users, loadingUsers, losers } = useUsers();

  // Keep the display 1-based for users
  const tableHead = [
    'Username',
    ...[...Array(Number(NUMBER_OF_WEEKS))].map((_, i) => `Week ${i + 1}`),
  ];

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
        const entryNumber = index + 1;
        const isNotActive = (entryNumber: number) => {
          const userWithPicks = users.find((u) => u.id === user?.id);
          if (!userWithPicks?.Picks || !losers) return false;

          const entryPicks = userWithPicks.Picks.filter(
            (pick) => pick.entryNumber === entryNumber
          );

          // Check if ANY pick for this entry matches ANY loser
          return entryPicks.some((pick) =>
            losers.some(
              (loser) => loser.team === pick.team && loser.week === pick.week
            )
          );
        };
        const userName = (
          <>
            {user.username}{' '}
            <Text
              className={
                !isNotActive(index) ? 'text-emerald-500' : 'text-red-500'
              }
            >
              ({entryNumber})
            </Text>
          </>
        );
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
        <Table className="w-full border rounded-lg border-zinc-700">
          <TableHeader>
            <TableRow className="border-b rounded-t-lg border-zinc-700 bg-zinc-900">
              {tableHead.map((header, index) => (
                <TableHead
                  key={`header-${index}`}
                  className={`text-white text-center font-medium p-2.5 ${
                    index === 0 ? 'w-48' : 'w-24'
                  }`}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((rowData, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={`border-b border-zinc-700 bg-zinc-900 `}
                // ${
                //   rowIndex % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-900'
                // }
              >
                {rowData.map((cellData, cellIndex) => (
                  <TableData
                    key={`${rowIndex}-${cellIndex}`}
                    className={`${
                      cellIndex === 0 ? 'w-48' : 'w-24'
                    } text-center`}
                    style={{
                      color: rowStyles[rowIndex][cellIndex].color,
                      fontSize: rowStyles[rowIndex][cellIndex].fontSize,
                      padding: rowStyles[rowIndex][cellIndex].padding,
                    }}
                  >
                    {cellData}
                  </TableData>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollView>
    </View>
  );
}
