require('dotenv').config();
const bcrypt = require('bcrypt');
const prisma = require('../src/utils/prisma');

async function main() {
  console.log('Seeding database...');
  
  // Check if admin exists
  const adminEmail = 'admin@investx.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    console.log(`Creating default admin user: ${adminEmail}`);
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        cashBalance: 100000.00
      }
    });
    console.log('Admin user created successfully.');
  } else {
    console.log('Admin user already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
