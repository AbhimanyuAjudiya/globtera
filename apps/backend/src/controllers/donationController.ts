import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { donateToOrg } from '../utils/stellarUtils';

const prisma = new PrismaClient();

export const processDonation = async (req: Request, res: Response) => {
  const { userId, orgId, amount } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const org = await prisma.org.findUnique({ where: { id: orgId } });

    if (!user || !org) {
      return res.status(404).json({ error: 'User or Organization not found' });
    }

    // Process the donation via Stellar
    await donateToOrg(org.walletAddress, amount);

    // Record the donation in the database
    const donation = await prisma.donation.create({
      data: {
        amount,
        userId,
        orgId,
      },
    });

    // Update total donations for the organization
    await prisma.org.update({
      where: { id: orgId },
      data: {
        totalDonation: { increment: amount },
      },
    });

    res.status(200).json(donation);
  } catch (error) {
    console.error('Error processing donation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
