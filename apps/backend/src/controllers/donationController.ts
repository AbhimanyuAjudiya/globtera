import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Keypair, Horizon, TransactionBuilder, Networks, Operation, Asset, BASE_FEE, Memo } from 'stellar-sdk';

// Stellar server instance
const server = new Horizon.Server('https://horizon-testnet.stellar.org');

const prisma = new PrismaClient();

export const donateToOrg = async (req: Request, res: Response) => {
  const { userId, orgId, amount, secretKey } = req.body;

  try {
    // Retrieve the destination public key (organization's wallet address)
    const org = await prisma.org.findUnique({
      where: { id: orgId },
    });

    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const destinationPublicKey = org.walletAddress;

    // Retrieve the source account
    const sourceKeypair = Keypair.fromSecret(secretKey);
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

    // Create a transaction
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.payment({
        destination: destinationPublicKey,
        asset: Asset.native(),
        amount: amount.toString(),
      }))
      .addMemo(Memo.text(`Donation from user ${userId}`))
      .setTimeout(30)
      .build();

    // Sign the transaction
    transaction.sign(sourceKeypair);

    // Submit the transaction
    const transactionResult = await server.submitTransaction(transaction);

    // Log the transaction result
    console.log('Success! Results:', transactionResult);

    // Record the donation in the database
    const donation = await prisma.donation.create({
      data: {
        userId,
        orgId,
        amount: parseFloat(amount),
      },
    });

    // Update the organization's total donation
    await prisma.org.update({
      where: { id: orgId },
      data: { totalDonation: { increment: parseFloat(amount) } },
    });

    res.status(201).json({ message: 'Donation successful', donation });
  } catch (error) {
    console.error('Something went wrong!', error);
    res.status(500).json({ error: 'Donation failed' });
  }
};
