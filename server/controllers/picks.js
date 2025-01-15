import { PrismaClient } from '@prisma/client';
import { getStartingWeek } from '../utils/dates.js';

const prisma = new PrismaClient();

export const createPicks = async (req, res) => {
  const { picks, week } = req.body;
  const userId = req.user.id; // From auth middleware

  const filteredPicks = picks.filter((item) => item != null);

  // Makes it impossible to make a pick if week has past
  if (Number(week + 1) < getStartingWeek()) {
    console.log('picks are too late');
    return res.status(400).json({ error: 'You are too late bru' });
  }

  try {
    console.log('REQ:', req.body);
    console.log('Filtered picks:', filteredPicks);
    console.log('Starting week:', getStartingWeek());

    // Check if any teams have been picked before in other weeks
    for (let pick of filteredPicks) {
      const existingPick = await prisma.picks.findFirst({
        where: {
          userId: userId,
          entryNumber: pick.entry,
          team: pick.pick,
          NOT: {
            week: week,
          },
        },
      });

      if (existingPick) {
        return res.status(400).json({
          error: `Pick ${pick.pick} already exists in entry ${pick.entry + 1}`,
        });
      }
    }

    // If no existing picks were found, proceed with creating or updating the picks
    for (let pick of filteredPicks) {
      await prisma.picks.upsert({
        where: {
          userId_week_entryNumber: {
            userId: userId,
            week: week,
            entryNumber: pick.entry,
          },
        },
        update: {
          team: pick.pick,
        },
        create: {
          userId: userId,
          week: week,
          team: pick.pick,
          entryNumber: pick.entry,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: `successfully updated picks for week ${week}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
