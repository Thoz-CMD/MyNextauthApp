// Prisma seed script
// Run with: npx prisma db seed
// This will create (upsert) an admin user and a demo member user if they don't exist.

// Use CommonJS requires to avoid needing "type": "module" in package.json
let PrismaClient;
try {
  ({ PrismaClient } = require('@prisma/client'));
} catch (e) {
  console.warn('[seed] Prisma client not generated yet. Attempting to run `npx prisma generate`...');
  const { execSync } = require('child_process');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    ({ PrismaClient } = require('@prisma/client'));
    console.log('[seed] Prisma client loaded after generate.');
  } catch (genErr) {
    console.error('[seed] Failed to auto-generate Prisma client:', genErr);
    process.exit(1);
  }
}
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminEmail = 'admin@example.com';
  const memberEmail = 'member@example.com';

  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);
  const memberPasswordHash = await bcrypt.hash('MemberPassword123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      password: adminPasswordHash,
      role: 'admin'
    }
  });

  const member = await prisma.user.upsert({
    where: { email: memberEmail },
    update: {},
    create: {
      email: memberEmail,
      name: 'Member',
      password: memberPasswordHash,
      role: 'member'
    }
  });

  console.log('Seed complete:', { admin: admin.email, member: member.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
