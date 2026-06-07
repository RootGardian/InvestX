require('dotenv').config();
const prisma = require('./src/utils/prisma');

async function main() {
  const usersToDelete = await prisma.user.findMany({
    where: {
      role: 'USER'
    }
  });

  console.log(`Found ${usersToDelete.length} normal users to delete.`);

  for (const user of usersToDelete) {
    // Delete related data first (cascade)
    await prisma.$transaction(async (tx) => {
      await tx.order.deleteMany({ where: { userId: user.id } });
      await tx.priceAlert.deleteMany({ where: { userId: user.id } });
      await tx.transaction.deleteMany({ where: { userId: user.id } });
      await tx.portfolioAsset.deleteMany({ where: { userId: user.id } });
      await tx.user.delete({ where: { id: user.id } });
    });
  }

  console.log('All normal users and their data have been deleted.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
