import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const hashedPasswordUser1 = await bcrypt.hash('password123', 10);
  const hashedPasswordUser2 = await bcrypt.hash('password456', 10);
  const hashedPasswordOrg1 = await bcrypt.hash('password789', 10);
  const hashedPasswordOrg2 = await bcrypt.hash('password101', 10);

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'User One',
      password: hashedPasswordUser1,
      walletAddress: 'user1-wallet-address',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'User Two',
      password: hashedPasswordUser2,
      walletAddress: 'user2-wallet-address',
    },
  });

  // Create organizations
  const org1 = await prisma.org.create({
    data: {
      email: 'org1@example.com',
      name: 'Org One',
      password: hashedPasswordOrg1,
      walletAddress: 'org1-wallet-address',
      totalDonation: 0,
    },
  });

  const org2 = await prisma.org.create({
    data: {
      email: 'org2@example.com',
      name: 'Org Two',
      password: hashedPasswordOrg2,
      walletAddress: 'org2-wallet-address',
      totalDonation: 0,
    },
  });

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Post One',
      content: 'Content of the first post.',
      publishedOn: new Date(),
      publishedBy: 'User One',
      orgId: org1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Post Two',
      content: 'Content of the second post.',
      publishedOn: new Date(),
      publishedBy: 'User Two',
      orgId: org2.id,
    },
  });

  console.log({ user1, user2, org1, org2, post1, post2 });
}

main()
  .then(() => {
    console.log('Seed data created successfully');
  })
  .catch((e) => {
    console.error('Error creating seed data:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
