import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { generateToken } from '../utils/jwtUtils';
import { Keypair } from '@stellar/stellar-sdk';
import { fundStellarAccount } from '../utils/stellarUtils';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate Stellar keypair
    const keypair = Keypair.random();
    const publicKey = keypair.publicKey();
    const secretKey = keypair.secret();

    // Fund the Stellar account with test XLM
    await fundStellarAccount(publicKey);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        walletAddress: publicKey,
      },
    });

    const token = generateToken(user.id, user.email);
    res.status(201).json({ token, secretKey, user });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ error: 'User registration failed' });
  }
};

export const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user.id, user.email);
      res.json({ token, user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'User authentication failed' });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  const userId = req.user.id; // Assuming req.user is set by auth middleware

  console.log('Fetching details for user:', userId); // Add logging

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        walletAddress: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};
