import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const donateToOrg = async (req: Request, res: Response) => {
  const { userId, orgId, amount } = req.body;

  try {
    const donation = await prisma.donation.create({
      data: {
        userId,
        orgId,
        amount,
      },
    });

    // Update the organization's total donation
    await prisma.org.update({
      where: { id: orgId },
      data: { totalDonation: { increment: amount } },
    });

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ error: 'Donation failed' });
  }
};
