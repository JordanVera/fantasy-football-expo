import { Icon } from '../ui/icon';
import { View } from 'react-native';
import TEAMS from '@/src/types/TEAMS';
import { Button, ButtonText } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react-native';
import { getAvailableWeeks, getStartingWeek } from '@/src/utils/dates';
import { ActionsheetScrollView } from '@/src/components/ui/actionsheet';

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

  return (
    <Accordion
      size="md"
      variant="filled"
      type="single"
      isCollapsible={true}
      isDisabled={false}
      className="my-5 border border-outline-200"
    >
      {availableWeeks.map((week, index) => (
        <AccordionItem
          key={`week-${week}`}
          value={week.toString()}
          className="border-b border-gray-400"
        >
          <AccordionHeader>
            <AccordionTrigger>
              {({ isExpanded }) => {
                return (
                  <>
                    <AccordionTitleText>Week {week}</AccordionTitleText>
                    {isExpanded ? (
                      <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                    ) : (
                      <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                    )}
                  </>
                );
              }}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <View className="flex flex-col gap-4">
              {[...Array(user?.bullets || 0)].map((_, index) => (
                <Select key={`entry-${index}`}>
                  <SelectTrigger>
                    <SelectInput placeholder={`Pick ${index + 1}`} />
                    <SelectIcon>
                      <Icon as={ChevronDownIcon} />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent className="max-h-64">
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <ActionsheetScrollView>
                        {TEAMS.map((team) => (
                          <SelectItem key={team} label={team} value={team} />
                        ))}
                      </ActionsheetScrollView>
                    </SelectContent>
                  </SelectPortal>
                </Select>
              ))}

              <Button className="text-white bg-blue-500">
                <ButtonText>Submit</ButtonText>
              </Button>
            </View>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// const WeeksAccordion = ({
//   user,
//   updateUserPicks,
//   setOpenPicksDialog,
//   setAssignmentError,
//   TEAMS,
// }) => {
//   const { userLoserEntries } = useUser();
//   const [open, setOpen] = useState(-1);
//   const [picks, setPicks] = useState([]);
//   const [week, setWeek] = useState('');

//   const handleOpen = (value) => setOpen(open === value ? 0 : value);

//   // Function to handle the form submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const res = await updateUserPicks(week, picks);

//       if (res.error) {
//         setAssignmentError(res.error);
//       } else {
//         setOpenPicksDialog(false);
//       }
//     } catch (error) {
//       setAssignmentError('An unexpected error occurred');
//     }
//   };

//   const handleWeekChange = (week) => {
//     setWeek(week);
//   };

//   const handlePickChange = (index, value) => {
//     const newPicks = [...picks];
//     newPicks[index] = { entry: index, pick: value };
//     setPicks(newPicks);
//   };

//   const groupedPicks = user.Picks.reduce((grouped, pick) => {
//     (grouped[pick.entryNumber] = grouped[pick.entryNumber] || {})[pick.week] =
//       pick;
//     return grouped;
//   }, {});

//   useEffect(() => {
//     console.log('hro');
//     console.log(groupedPicks);
//   }, [groupedPicks]);

//   // const hasLosingPickInPreviousWeeks = (entryNumber, currentWeek) => {
//   //   for (let week = 1; week < currentWeek; week++) {
//   //     // Check if the entry exists in groupedPicks
//   //     if (groupedPicks[entryNumber]) {
//   //       const pick = groupedPicks[entryNumber][week];

//   //       // console.log('pick');
//   //       // console.log({ pick });

//   //       // Check if the pick exists and is in the losers array
//   //       if (pick) {
//   //         const isLoser = losers.some(
//   //           (loser) => loser.week === pick.week && loser.team === pick.team
//   //         );

//   //         if (isLoser) {
//   //           return true;
//   //         }
//   //       }
//   //     }
//   //   }

//   //   return false;
//   // };

//   return (
//     <div className="flex flex-col gap-3">
//       {Array.from({ length: 18 }).map((_, weekIndex) => {
//         return weekIndex < getStartingWeek() ? null : (
//           <Accordion
//             key={weekIndex}
//             open={open === weekIndex}
//             icon={<Icon id={1} open={open} />}
//             disabled={weekIndex < getStartingWeek()}
//           >
//             <AccordionHeader
//               onClick={() => {
//                 handleOpen(weekIndex);
//                 handleWeekChange(weekIndex);
//               }}
//               className="capitalize text-primary hover:text-secondary hover:border-blue-600"
//             >
//               Week {weekIndex + 1}
//             </AccordionHeader>
//             <AccordionBody>
//               <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
//                 {Array.from({ length: user.bullets }).map((_, j) => {
//                   // console.log({ j, weekIndex });
//                   // console.log(hasLosingPickInPreviousWeeks(j, weekIndex + 1));

//                   // const isLoser = losers.some(
//                   //   (loser) =>
//                   //     loser.week === weekIndex + 1 && loser.team === pick
//                   // );
//                   return (
//                     <div
//                       className="flex flex-col gap-1"
//                       key={`${j}-${weekIndex}`}
//                     >
//                       <label className="text-primary">
//                         Entry {j + 1}
//                         {userLoserEntries.includes(j) && (
//                           <span className="text-red-500"> - (Lost)</span>
//                         )}
//                       </label>
//                       <select
//                         key={j}
//                         className="px-2 py-3 capitalize bg-gray-300 border border-gray-400 rounded-md text-primary dark:bg-gray-900 dark:border-gray-800"
//                         onChange={(e) => handlePickChange(j, e.target.value)}
//                         disabled={userLoserEntries.includes(j)}
//                       >
//                         {TEAMS.map((team, index) => (
//                           <option
//                             key={index}
//                             value={team}
//                             className="text-primary"
//                           >
//                             {team}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   );
//                 })}

//                 <Button
//                   type="submit"
//                   className="capitalize"
//                   color="blue"
//                   size="sm"
//                   disabled={user.bullets === 0}
//                 >
//                   submit
//                 </Button>
//               </form>
//             </AccordionBody>
//           </Accordion>
//         );
//       })}
//     </div>
//   );
// };
