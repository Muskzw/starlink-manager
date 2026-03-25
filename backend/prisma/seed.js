const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create test Users
  await prisma.user.createMany({
    data: [
      { name: 'Alice Admin', email: 'alice@starops.com', role: 'Super Admin', status: 'Active' },
      { name: 'Bob Manager', email: 'bob@starops.com', role: 'Manager', status: 'Active' },
      { name: 'Charlie Temp', email: 'charlie@starops.com', role: 'Viewer', status: 'Inactive' },
    ]
  });

  // Create Payment Methods
  const mainCard = await prisma.paymentMethod.create({
    data: {
      name: 'Main Corporate Card', type: 'Visa', last4: '4242', balance: 24500.00,
      color: 'linear-gradient(135deg, #4318FF 0%, #868CFF 100%)'
    }
  });

  const backupCard = await prisma.paymentMethod.create({
    data: {
      name: 'Backup Virtual Card', type: 'Mastercard', last4: '8899', balance: 3200.00,
      color: 'linear-gradient(135deg, #111c44 0%, #2b3674 100%)'
    }
  });

  const teamCard = await prisma.paymentMethod.create({
    data: {
      name: 'Team Expenses', type: 'Visa', last4: '1122', balance: 850.00,
      color: 'linear-gradient(135deg, #05cd99 0%, #43e794 100%)'
    }
  });

  // Create Subscriptions
  const sub1 = await prisma.subscription.create({
    data: {
      customer: 'John Doe', location: 'HQ Business', plan: 'Business',
      cost: 500.00, date: '15th', status: 'Active', cardId: mainCard.id
    }
  });

  const sub2 = await prisma.subscription.create({
    data: {
      customer: 'Sarah Smith', location: 'Remote Site A', plan: 'Residential',
      cost: 110.00, date: '16th', status: 'Active', cardId: backupCard.id
    }
  });

  const sub3 = await prisma.subscription.create({
    data: {
      customer: 'Acme Corp', location: 'Backup Link', plan: 'Roam',
      cost: 150.00, date: '18th', status: 'Suspended', cardId: null
    }
  });

  // Create Payment History
  await prisma.paymentHistory.create({
    data: {
      amount: 500, status: 'Success', receipt: '#REC-42091',
      subscriptionId: sub1.id, methodId: mainCard.id,
      date: new Date('2023-10-12T14:32:00Z')
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
