import { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { Button, ButtonText } from '@/src/components/ui/button';
import { Icon } from '@/src/components/ui/icon';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  ClipboardCheckIcon,
} from 'lucide-react-native';
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

  const { fetchUsers, losers } = useUsers();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'week' | 'picks'>('week');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [picks, setPicks] = useState<Array<{ entry: number; pick: string }>>(
    []
  );
  const [availableWeeks, setAvailableWeeks] = useState<number[]>([]);
  const [loadingWeeks, setLoadingWeeks] = useState<boolean>(false);

  useEffect(() => {
    fetchWeeks();
  }, []);

  const fetchWeeks = async () => {
    try {
      setLoadingWeeks(true);
      const weeks = await api.getAvailableWeeks();
      setAvailableWeeks(weeks);
    } catch (error) {
      console.error('Error fetching weeks:', error);
    } finally {
      setLoadingWeeks(false);
    }
  };

  const handleWeekSelect = (week: number) => {
    setSelectedWeek(week - 1);
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
    if (selectedWeek === null) return;

    try {
      const response = await api.createPicks(picks, selectedWeek);

      if (response.success) {
        await refreshUser();
        await fetchUsers();
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
                  Successfully submitted picks for week {selectedWeek + 1}
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
        pick.week !== selectedWeek // selectedWeek is already 0-based
    );
  };

  const hasLosingPick = (entryNumber: number) => {
    if (!user?.Picks || !losers) return false;

    // Get all picks for this entry number
    const entryPicks = user.Picks.filter(
      (pick) => pick.entryNumber === entryNumber
    );

    // Check if any of the picks for this entry match a loser
    return entryPicks.some((pick) =>
      losers.some(
        (loser) => loser.team === pick.team && loser.week === pick.week
      )
    );
  };

  const hasNoActiveEntries = () => {
    if (!user?.bullets) return true;
    return [...Array(user.bullets)].every((_, index) => hasLosingPick(index));
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
          <Button onPress={() => setStep('week')} className="p-2">
            <Icon as={ChevronLeftIcon} className="text-gray-400" />
            <ButtonText>Back</ButtonText>
          </Button>
          <Text className="text-lg font-semibold text-white">
            Week {selectedWeek !== null ? selectedWeek + 1 : ''} Picks
          </Text>
        </View>

        <ActionsheetScrollView className="pt-5">
          <View className="flex gap-10 space-y-4">
            {[...Array(user?.bullets || 0)].map((_, index) => {
              // Skip rendering this entry if it has a losing pick

              if (hasLosingPick(index)) return null;

              return (
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
              );
            })}

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
      <Button onPress={() => setIsOpen(true)} className="flex-1 bg-emerald-500">
        <ButtonText>Make Picks</ButtonText>
        <Icon as={ClipboardCheckIcon} className="text-white" size={'md'} />
      </Button>

      <Actionsheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="max-h-[75%] bg-zinc-800 border-0">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-zinc-500" />
          </ActionsheetDragIndicatorWrapper>
          {hasNoActiveEntries() ? (
            <View className="items-center justify-center p-4 py-10 rounded-lg bg-zinc-800">
              <Image
                source={require('../../media/sad.gif')}
                style={{ width: 150, height: 150, marginBottom: 16 }}
              />
              <Text className="text-3xl font-medium text-white">
                Sorry, looks like you're out
              </Text>
              <Text className="text-xl text-white">
                You have no active entries 😢
              </Text>
            </View>
          ) : loadingWeeks ? (
            <View className="items-center justify-center flex-1">
              <Text className="text-white">Loading...</Text>
            </View>
          ) : (
            renderContent()
          )}
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}
