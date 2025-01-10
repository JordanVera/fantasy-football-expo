import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableData,
  TableRow,
  TableFooter,
} from '@/src/components/ui/table';
import { useUsers } from '@/src/context/UserContext';
import { NUMBER_OF_WEEKS } from '@env';
import { ScrollView, Text } from 'react-native';
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

  // Create table data and styles
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
    <ScrollView horizontal className="w-full">
      <Table className="w-full border border-gray-700">
        <TableHeader>
          <TableRow className="bg-gray-900 border-b border-gray-700">
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
              className="bg-gray-900 border-b border-gray-700"
            >
              {rowData.map((cellData, cellIndex) => (
                <TableData
                  key={`${rowIndex}-${cellIndex}`}
                  className={`${cellIndex === 0 ? 'w-48' : 'w-24'} text-center`}
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
  );
}
