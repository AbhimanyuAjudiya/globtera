import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'User One',
      password: 'password123', // Note: This is just an example, in practice, hash passwords
      wallets: {
        create: [
          { address: 'wallet_address_1' },
          { address: 'wallet_address_2' }
        ]
      }
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'User Two',
      password: 'password456',
      wallets: {
        create: [
          { address: 'wallet_address_3' }
        ]
      }
    }
  });

  // Create organizations
  const org1 = await prisma.org.create({
    data: {
      email: 'org1@example.com',
      name: 'Organization One',
      password: 'orgpassword123',
      wallets: {
        create: [
          { address: 'org_wallet_address_1' }
        ]
      }
    }
  });

  const org2 = await prisma.org.create({
    data: {
      email: 'org2@example.com',
      name: 'Organization Two',
      password: 'orgpassword456',
      wallets: {
        create: [
          { address: 'org_wallet_address_2' }
        ]
      }
    }
  });

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: 'First Post',
      content: 'Content of the first post.',
      publishedOn: new Date(),
      publishedBy: user1.name,
      orgId: org1.id
    }
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Second Post',
      content: 'Content of the second post.',
      publishedOn: new Date(),
      publishedBy: user2.name,
      orgId: org2.id
    }
  });

  // Create donations
  await prisma.donation.create({
    data: {
      amount: 100,
      userId: user1.id,
      orgId: org1.id,
      postId: post1.id
    }
  });

  await prisma.donation.create({
    data: {
      amount: 50,
      userId: user2.id,
      orgId: org2.id,
      postId: post2.id
    }
  });

  console.log('Seed data populated successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
