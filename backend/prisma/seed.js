const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {}, // If user exists, don't update anything
    create: {
      username: 'admin',
      email: 'admin@admin.com',
      password: hashedPassword, // Hash before saving!
      role: 'ADMIN', // Assign ADMIN role
    },
  });

  console.log('✅ Admin user created:', adminUser);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
