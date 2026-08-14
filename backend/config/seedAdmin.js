import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB } from './db.js';

dotenv.config();

/**
 * Dedicated Admin Seeder Script
 * Supports:
 *   1. Environment Variables: ADMIN_EMAIL="raj.cse.23@nitap.ac.in" ADMIN_PASSWORD="Test123" ADMIN_NAME="Raj Kumar" npm run seed:admin
 *   2. CLI Flags: npm run seed:admin --email=raj.cse.23@nitap.ac.in --password=Test123 --name="Raj Kumar"
 *   3. Position / npm args
 */
export const seedAdmin = async () => {
  try {
    await connectDB();

    // Check environment variables first
    let name = process.env.ADMIN_NAME;
    let email = process.env.ADMIN_EMAIL;
    let password = process.env.ADMIN_PASSWORD;

    // Parse CLI arguments
    const rawArgs = process.argv.slice(2);
    
    rawArgs.forEach((arg, index) => {
      // --key=value
      if (arg.startsWith('--email=')) email = arg.split('=')[1];
      if (arg.startsWith('--password=')) password = arg.split('=')[1];
      if (arg.startsWith('--name=')) name = arg.split('=')[1];

      // --key value
      if (arg === '--email' && rawArgs[index + 1]) email = rawArgs[index + 1];
      if (arg === '--password' && rawArgs[index + 1]) password = rawArgs[index + 1];
      if (arg === '--name' && rawArgs[index + 1]) name = rawArgs[index + 1];

      // Direct email detection (e.g. raj.cse.23@nitap.ac.in)
      if (arg.includes('@') && !arg.startsWith('--')) {
        email = arg;
      }
    });

    // Defaults if not provided
    if (!email) email = 'admin@prores.edu';
    if (!password) password = 'adminPassword123';
    if (!name) name = 'Raj Kumar';

    console.log(`🔐 Processing Admin Account Seeding for: ${email}...`);

    let existingAdmin = await User.findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
      existingAdmin.name = name;
      existingAdmin.password = password; // Hashed automatically by userSchema pre-save hook
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log(`✅ Admin account updated successfully: ${email}`);
    } else {
      await User.create({
        name,
        email: email.toLowerCase(),
        password, // Hashed automatically by userSchema pre-save hook
        role: 'admin',
      });
      console.log(`✅ Admin account created successfully: ${email}`);
    }

    console.log(`
🔑 Admin Credentials Summary:
   - Name: ${name}
   - Email: ${email}
   - Password: ${password}
   - Role: admin
`);
  } catch (error) {
    console.error('❌ Error seeding Admin account:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedAdmin();
