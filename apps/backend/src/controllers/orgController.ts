import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { generateToken } from '../utils/jwtUtils';

const prisma = new PrismaClient();

export const registerOrg = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const org = await prisma.org.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const token = generateToken(org.id, org.email);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Organization registration failed' });
  }
};

export const authOrg = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const org = await prisma.org.findUnique({ where: { email } });

    if (org && (await bcrypt.compare(password, org.password))) {
      const token = generateToken(org.id, org.email);
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Organization authentication failed' });
  }
};

export const getAllOrgs = async (req: Request, res: Response) => {
  try {
    const orgs = await prisma.org.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        totalDonation: true,
        // Include other fields as needed
      },
    });
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
};
