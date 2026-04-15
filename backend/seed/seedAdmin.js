import 'dotenv/config';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { connectDB } from '../config/db.js';
import {
  SEEDED_ADMIN_ACCOUNTS,
  SEEDED_ADMIN_EMAILS,
} from '../constants/seededAdmins.js';

const seedAdmins = async () => {
  try {
    await connectDB();
    console.log('🔗 Database connected for seeding');

    const seedPassword = process.env.SEED_ADMIN_PASSWORD || 'password123';
    const hashedPassword = await bcrypt.hash(seedPassword, 12);

    const removed = await User.deleteMany({
      role: 'admin',
      email: { $nin: SEEDED_ADMIN_EMAILS },
    });
    if (removed.deletedCount > 0) {
      console.log(`Removed ${removed.deletedCount} non-seeded admin account(s).`);
    }

    for (const acc of SEEDED_ADMIN_ACCOUNTS) {
      const email = acc.email.toLowerCase();
      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            name: acc.name,
            email,
            password: hashedPassword,
            role: 'admin',
            department: acc.department,
          },
        },
        { upsert: true, new: true, runValidators: true }
      );
      console.log(`Seeded admin: ${acc.name} <${email}> — ${acc.department}`);
    }

    console.log('\nSeeded department admins are ready.');
    console.log(`   Shared seed password (override with SEED_ADMIN_PASSWORD): ${seedPassword}`);
    console.log('   Accounts:');
    SEEDED_ADMIN_ACCOUNTS.forEach((a) => {
      console.log(`   • ${a.email} → ${a.department}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admins:', error);
    process.exit(1);
  }
};

seedAdmins();
