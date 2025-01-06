import moment from 'moment';
import { Moment } from 'moment';

// Dates are 1 hour ahead of central time, use eastern time.
const dates: Moment[] = [
  moment('2022-09-05'), // Week 1
  moment('2022-09-12'), // Week 2
  moment('2022-09-19'), // Week 3
  moment('2023-09-26'), // Week 4
  moment('2023-10-03'), // Week 5
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

const getAvailableWeeks = (): number[] => {
  const startingWeek: number = getStartingWeek();

  const weeks: number[] = new Array(22)
    .fill(0)
    .map((_, index) => index + 1)
    .filter((week) => week >= startingWeek);
  return weeks;
};

const getStartingWeek = (): number => {
  const now: Moment = moment();

  const startingWeek: number = dates.findIndex((date: Moment) => {
    const startInHours: number = date.diff(now, 'hour');
    return startInHours > 0;
  });

  return startingWeek;
};

export { getAvailableWeeks, getStartingWeek };
