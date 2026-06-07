require('dotenv').config();
const prisma = require('./src/utils/prisma');
const { hashPassword } = require('./src/utils/crypto');

async function main() {
  const email = 'admin@investx.com';
  const password = 'admin';

  const passwordHash = await hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      name: 'Super Admin',
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      email,
      name: 'Super Admin',
      passwordHash,
      role: 'ADMIN',
      cashBalance: 1000000.00
    }
  });

  console.log(`Admin created/updated successfully! Email: ${admin.email}, Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
