import moment from 'moment';

const dates = [
  moment('2023-09-05'), // Week 1
  moment('2024-09-12'), // Week 2
  moment('2024-09-19'), // Week 3
  moment('2024-09-26'), // Week 4
  moment('2024-10-03'), // Week 5
  moment('2025-10-10'), // Week 6
  moment('2025-10-17'), // Week 7
  moment('2025-10-24'), // Week 8
  moment('2025-10-31'), // Week 9
  moment('2025-11-07'), // Week 10
  moment('2025-11-14'), // Week 11
  moment('2025-11-21'), // Week 12
  moment('2025-11-28'), // Week 13
  moment('2025-12-05'), // Week 14
  moment('2025-12-12'), // Week 15
  moment('2025-12-19'), // Week 16
  moment('2025-12-26'), // Week 17
  moment('2026-01-02'), // Week 18
  moment('2026-01-09'), // Week 19 (Wild Card)
  moment('2026-01-16'), // Week 20 (Divisional)
  moment('2026-01-23'), // Week 21 (Conference)
  moment('2026-01-30'), // Week 22 (Super Bowl)
];

const getStartingWeek = () => {
  const now = moment();

  const startingWeek = dates.findIndex((date) => {
    return now.isBefore(date);
  });

  return startingWeek + 1; // ! +1 because findindex is 0 based
};

const getAvailableWeeks = (all = false) => {
  const startingWeek = getStartingWeek();

  // ! 22 is number of weeks in the season including playoffs
  const weeks = Array.from({ length: 22 }, (_, i) => i + 1).filter(
    (week) => week >= startingWeek
  );

  return weeks;
};

export { getAvailableWeeks, getStartingWeek };
