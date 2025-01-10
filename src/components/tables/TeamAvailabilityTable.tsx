import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableData,
  TableRow,
} from '@/src/components/ui/table';
import { useUsers } from '@/src/context/UserContext';
import TEAMS, { NFLTeam } from '@/src/types/TEAMS';

// Define interface for team counts
interface TeamCounts {
  [key: string]: number;
}

export default function TeamAvailabilityTable() {
  const { users, losers } = useUsers();

  // Calculate team availability counts
  const teamCounts: TeamCounts = TEAMS.reduce((counts, team) => {
    counts[team] = 0;
    return counts;
  }, {} as TeamCounts);

  // Track total active entries
  let numberOfTotalActiveEntries = 0;

  // Count available teams for active entries
  users?.forEach((user) => {
    // Group picks by entry number
    const groupedPicks = user.Picks?.reduce((grouped, pick) => {
      (grouped[pick.entryNumber] = grouped[pick.entryNumber] || []).push(pick);
      return grouped;
    }, {} as { [key: number]: typeof user.Picks });

    // For each entry the user has
    [...Array(user.bullets || 0)].forEach((_, entryIndex) => {
      const entryPicks = groupedPicks?.[entryIndex] || [];

      // Check if this entry is still active (hasn't picked a losing team)
      const isEntryActive = !entryPicks.some((pick) =>
        losers?.some(
          (loser) => loser.week === pick.week && loser.team === pick.team
        )
      );

      if (isEntryActive) {
        numberOfTotalActiveEntries++;

        // For each team, check if this entry has already used it
        TEAMS.forEach((team) => {
          if (!entryPicks.some((pick) => pick.team === team)) {
            teamCounts[team]++;
          }
        });
      }
    });
  });

  const cellStyle = 'w-16 px-2 py-2 text-center border-gray-700';

  return (
    <View className="w-full">
      <ScrollView horizontal className="w-full">
        <Table className="w-full border border-gray-700 rounded-lg">
          <TableHeader>
            <TableRow className="bg-gray-900 border-b border-gray-700 rounded-t-lg">
              {TEAMS.map((team, index) => (
                <TableHead
                  key={index}
                  className={`${cellStyle} text-xs font-medium tracking-wider text-white ${
                    index !== TEAMS.length - 1 ? 'border-r' : ''
                  }`}
                >
                  {team}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-gray-900 border-b border-gray-700 rounded-b-lg">
              {TEAMS.map((team, index) => (
                <TableData
                  key={index}
                  className={`${cellStyle}  ${
                    index !== TEAMS.length - 1 ? 'border-r' : ''
                  }`}
                >
                  <View className="flex-col items-center w-full">
                    <Text className="text-white">{teamCounts[team]}</Text>
                    <Text className="text-xs text-gray-500">
                      {numberOfTotalActiveEntries
                        ? `${(
                            (teamCounts[team] / numberOfTotalActiveEntries) *
                            100
                          ).toFixed(1)}%`
                        : '0%'}
                    </Text>
                  </View>
                </TableData>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </ScrollView>
    </View>
  );
}
