import { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, ButtonText } from '@/src/components/ui/button';
import { Icon } from '@/src/components/ui/icon';
import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react-native';
import { getAvailableWeeks } from '@/src/utils/dates';
import { useAuth } from '@/src/context/AuthContext';
import { api } from '@/src/services/ApiService';
import TEAMS from '@/src/types/TEAMS';

import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
  ActionsheetScrollView,
} from '@/src/components/ui/actionsheet';

export default function MakePicksActionSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'week' | 'picks'>('week');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [picks, setPicks] = useState<Array<{ entry: number; pick: string }>>(
    []
  );

  const { user } = useAuth();
  const availableWeeks = getAvailableWeeks();

  const handleWeekSelect = (week: number) => {
    setSelectedWeek(week);
    setStep('picks');
  };

  const handlePickChange = (value: string, entryIndex: number) => {
    setPicks((prevPicks) => {
      const newPicks = [...prevPicks];
      const pickIndex = newPicks.findIndex((p) => p.entry === entryIndex);

      if (pickIndex >= 0) {
        newPicks[pickIndex] = { entry: entryIndex, pick: value };
      } else {
        newPicks.push({ entry: entryIndex, pick: value });
      }

      return newPicks;
    });
  };

  const handleSubmit = async () => {
    if (!selectedWeek) return;

    try {
      const response = await api.createPicks(picks, selectedWeek);
      console.log('Picks submitted successfully:', response);
      setIsOpen(false);
      setStep('week');
      setPicks([]);
      setSelectedWeek(null);
      // TODO: Add success toast
    } catch (error) {
      console.error('Failed to submit picks:', error);
      // TODO: Add error toast
    }
  };

  const renderContent = () => {
    if (step === 'week') {
      return (
        <>
          <Text className="px-4 py-2 text-lg font-semibold text-white">
            Select Week
          </Text>
          <ActionsheetScrollView>
            {availableWeeks.map((week) => (
              <ActionsheetItem
                key={week}
                onPress={() => handleWeekSelect(week)}
                className="flex-row items-center justify-between"
              >
                <ActionsheetItemText>Week {week}</ActionsheetItemText>
                <Icon as={ChevronRightIcon} className="text-gray-400" />
              </ActionsheetItem>
            ))}
          </ActionsheetScrollView>
        </>
      );
    }

    return (
      <>
        <View className="flex-row items-center justify-between px-4 py-2">
          <Button
            // variant="ghost"
            onPress={() => setStep('week')}
            className="p-2"
          >
            <Icon as={ChevronLeftIcon} className="text-gray-400" />
            <ButtonText>Back</ButtonText>
          </Button>
          <Text className="text-lg font-semibold text-white">
            Week {selectedWeek} Picks
          </Text>
        </View>

        <ActionsheetScrollView>
          <View className="p-4 space-y-4 ">
            {[...Array(user?.bullets || 0)].map((_, index) => (
              <View key={index} className="space-y-2">
                <Text className="text-white">Entry {index + 1}</Text>
                <View className="flex-row flex-wrap gap-2">
                  {TEAMS.map((team) => (
                    <Button
                      key={team}
                      variant={
                        picks.find((p) => p.entry === index && p.pick === team)
                          ? 'solid'
                          : 'outline'
                      }
                      onPress={() => handlePickChange(team, index)}
                      className="flex-grow basis-[30%]"
                    >
                      <ButtonText>{team}</ButtonText>
                    </Button>
                  ))}
                </View>
              </View>
            ))}

            <Button onPress={handleSubmit} className="w-full mt-4 bg-blue-600">
              <ButtonText>Submit Picks</ButtonText>
            </Button>
          </View>
        </ActionsheetScrollView>
      </>
    );
  };

  return (
    <>
      <Button onPress={() => setIsOpen(true)} className="bg-blue-600">
        <ButtonText>Make Picks</ButtonText>
      </Button>

      <Actionsheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="max-h-[85%] bg-gray-900 border border-gray-700">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-gray-500" />
          </ActionsheetDragIndicatorWrapper>
          {renderContent()}
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}
