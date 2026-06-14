import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { env } from '../config/env';
import { db } from '../db';
import { adminUsers } from '../db/schema';

async function seed() {
  const existing = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, env.ADMIN_USERNAME))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Admin user "${env.ADMIN_USERNAME}" already exists — skipping seed`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

  await db.insert(adminUsers).values({
    username: env.ADMIN_USERNAME,
    passwordHash,
  });

  console.log(`Seeded admin user "${env.ADMIN_USERNAME}"`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
