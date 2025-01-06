import { useState, useEffect } from 'react';
import { Icon } from '../ui/icon';
import { View } from 'react-native';
import TEAMS from '@/src/types/TEAMS';
import { Button, ButtonText } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react-native';
import { getAvailableWeeks, getStartingWeek } from '@/src/utils/dates';
import { ActionsheetScrollView } from '@/src/components/ui/actionsheet';
import { api } from '@/src/services/ApiService';

import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContent,
  AccordionContentText,
  AccordionIcon,
} from '@/src/components/ui/accordion';

import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
} from '@/src/components/ui/select';

export default function WeeksAccordion() {
  const availableWeeks = getAvailableWeeks();
  const startingWeek = getStartingWeek();

  const { user, logout } = useAuth();

  console.log({ availableWeeks, startingWeek });
  console.log({ user });

  const [picks, setPicks] = useState<any[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number>(startingWeek);

  useEffect(() => {
    console.log({ picks });
  }, [picks]);

  useEffect(() => {
    console.log({ picks });
  }, [picks]);

  const handleSubmit = async () => {
    try {
      const response = await api.createPicks(picks, selectedWeek);
      console.log('Picks submitted successfully:', response);
      // TODO: Add success toast/notification
    } catch (error) {
      console.error('Failed to submit picks:', error);
      // TODO: Add error toast/notification
    }
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

  return (
    <Accordion
      size="md"
      variant="filled"
      type="single"
      isCollapsible={true}
      isDisabled={false}
      className="my-5 bg-gray-900 border border-gray-700"
    >
      {availableWeeks.map((week, index) => (
        <AccordionItem
          key={`week-${week}`}
          value={week.toString()}
          className="border-b border-gray-700"
        >
          <AccordionHeader className="bg-gray-900">
            <AccordionTrigger>
              {({ isExpanded }) => {
                return (
                  <>
                    <AccordionTitleText className="text-white">
                      Week {week}
                    </AccordionTitleText>
                    {isExpanded ? (
                      <AccordionIcon
                        as={ChevronUpIcon}
                        className="ml-3 text-gray-400"
                      />
                    ) : (
                      <AccordionIcon
                        as={ChevronDownIcon}
                        className="ml-3 text-gray-400"
                      />
                    )}
                  </>
                );
              }}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className="bg-gray-900">
            <View className="flex flex-col gap-4">
              {[...Array(user?.bullets || 0)].map((_, index) => (
                <Select
                  key={`entry-${index}`}
                  onValueChange={(value) => handlePickChange(value, index)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectInput
                      placeholder={`Entry ${index + 1}`}
                      className="text-gray-300"
                    />
                    <SelectIcon>
                      <Icon as={ChevronDownIcon} className="text-gray-400" />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent className="bg-gray-800 max-h-64">
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <ActionsheetScrollView className="text-white">
                        {TEAMS.map((team) => (
                          <SelectItem
                            key={team}
                            label={team}
                            value={team}
                            className="text-white hover:bg-gray-700"
                          />
                        ))}
                      </ActionsheetScrollView>
                    </SelectContent>
                  </SelectPortal>
                </Select>
              ))}

              <Button
                onPress={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ButtonText className="text-white">Submit</ButtonText>
              </Button>
            </View>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// {
// 	"picks": [
// 		{
// 			"entry": 0,
// 			"pick": "ATL"
// 		},
// 		{
// 			"entry": 1,
// 			"pick": "ATL"
// 		},
// 		{
// 			"entry": 2,
// 			"pick": "ATL"
// 		},
// 		{
// 			"entry": 3,
// 			"pick": "ATL"
// 		}
// 	],
// 	"week": 0
// }
