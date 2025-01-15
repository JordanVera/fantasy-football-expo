import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        bullets: true,
        Picks: {
          select: {
            week: true,
            team: true,
            entryNumber: true,
          },
          orderBy: [{ week: 'asc' }, { entryNumber: 'asc' }],
        },
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUser = async (req, res) => {
  const userId = Number(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        bullets: true,
        Picks: {
          select: {
            id: true,
            week: true,
            team: true,
            entryNumber: true,
          },
          orderBy: [{ week: 'asc' }, { entryNumber: 'asc' }],
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
