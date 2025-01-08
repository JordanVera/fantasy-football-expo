import { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, ButtonText } from '@/src/components/ui/button';
import { Icon } from '@/src/components/ui/icon';
import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react-native';
import { getAvailableWeeks } from '@/src/utils/dates';
import { useAuth } from '@/src/context/AuthContext';
import { api } from '@/src/services/ApiService';
import * as Haptics from 'expo-haptics';
import TEAMS from '@/src/types/TEAMS';
import { useUsers } from '@/src/context/UserContext';
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from '@/src/components/ui/toast';

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
  const toast = useToast();
  const { user, refreshUser } = useAuth();

  const { fetchUsers } = useUsers();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'week' | 'picks'>('week');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [picks, setPicks] = useState<Array<{ entry: number; pick: string }>>(
    []
  );

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

      console.log({ response });

      if (response.success) {
        await refreshUser();
        const users = await fetchUsers();
        console.log('users FROM FEEEEE');
        console.log(users);
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );

        toast.show({
          placement: 'top',
          render: ({ id }) => {
            return (
              <Toast nativeID={`toast-${id}`} action="success" variant="solid">
                <ToastTitle>Success!</ToastTitle>
                <ToastDescription>
                  Successfully submitted picks for week {selectedWeek}
                </ToastDescription>
              </Toast>
            );
          },
        });

        setIsOpen(false);
        setStep('week');
        setPicks([]);
        setSelectedWeek(null);
      }
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // The error message will come from the API service
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to submit picks';

      toast.show({
        placement: 'top',
        render: ({ id }) => {
          return (
            <Toast nativeID={`toast-${id}`} action="error" variant="solid">
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>{errorMessage}</ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  const isTeamPickedForEntry = (team: string, entryIndex: number) => {
    if (!user?.Picks) return false;

    return user.Picks.some(
      (pick) =>
        pick.team === team &&
        pick.entryNumber === entryIndex &&
        pick.week !== selectedWeek // Only check other weeks
    );
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
                <ActionsheetItemText className="text-white">
                  Week {week}
                </ActionsheetItemText>
                <Icon as={ChevronRightIcon} className="text-white" />
              </ActionsheetItem>
            ))}
          </ActionsheetScrollView>
        </>
      );
    }

    return (
      <>
        <View className="flex-row items-center justify-between w-full py-2">
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

        <ActionsheetScrollView className="pt-5">
          <View className="flex gap-10 space-y-4">
            {[...Array(user?.bullets || 0)].map((_, index) => (
              <View key={index} className="space-y-2">
                <Text className="mb-3 font-semibold text-white">
                  Entry {index + 1}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {TEAMS.map((team) => {
                    const isDisabled = isTeamPickedForEntry(team, index);
                    const isSelected = picks.find(
                      (p) => p.entry === index && p.pick === team
                    );

                    return (
                      <Button
                        key={team}
                        variant={'solid'}
                        onPress={() => handlePickChange(team, index)}
                        disabled={isDisabled}
                        className={`flex-grow basis-[23%] ${
                          isSelected
                            ? 'bg-green-500'
                            : isDisabled
                            ? 'bg-zinc-600 opacity-50' // Greyed out style
                            : 'bg-zinc-700'
                        }`}
                      >
                        <ButtonText
                          className={`text-white ${
                            isDisabled ? 'opacity-50' : ''
                          }`}
                        >
                          {team}
                        </ButtonText>
                      </Button>
                    );
                  })}
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
        <ActionsheetContent className="max-h-[85%] bg-zinc-800 border-0">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-zinc-500" />
          </ActionsheetDragIndicatorWrapper>
          {renderContent()}
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}
