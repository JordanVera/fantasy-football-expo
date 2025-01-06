import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/test', (req, res) => {
  console.log('Hello World');

  res.status(200).json({ message: 'Hello World' });
});

// Register endpoint
app.post('/api/signup', async (req, res) => {
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

    // Generate token (same as login)
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return the same response format as login
    res.json({
      token,
      user: newUser, // newUser already excludes password due to select
    });
  } catch (error) {
    console.log('_____error_____');
    console.log(error);
    res.status(400).json({ error: 'User creation failed' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
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
        password: true, // We need this for verification but won't send it to client
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

    // Remove password from user object before sending to client
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.rainbow.bold);
});
