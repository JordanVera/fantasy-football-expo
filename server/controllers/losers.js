import prisma from '../lib/prisma.js';

export const getLosers = async (req, res) => {
  try {
    const losers = await prisma.loser.findMany({});

    return res.status(200).json({
      success: true,
      message: 'successfully retrieved losers data from db',
      losers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
