import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// Register endpoint - will be accessed at /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstname, lastname, username, phoneNumber } =
      req.body;

    // Validate required fields
    if (
      !email ||
      !password ||
      !firstname ||
      !lastname ||
      !username ||
      !phoneNumber
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists with email, username, or phone number
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }, { phoneNumber }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      if (existingUser.phoneNumber === phoneNumber) {
        return res
          .status(400)
          .json({ error: 'Phone number already registered' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstname,
        lastname,
        username,
        phoneNumber,
        bullets: 0,
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        username: true,
        phoneNumber: true,
        bullets: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: newUser,
    });
  } catch (error) {
    console.log('_____error_____');
    console.log(error);
    res.status(400).json({ error: 'User creation failed' });
  }
});

// Login endpoint - will be accessed at /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        username: true,
        phoneNumber: true,
        bullets: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

export default router;
