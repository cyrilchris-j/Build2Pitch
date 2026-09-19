const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB at:', env.MONGODB_URI);
    await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB connected.');

    // 1. Seed / Ensure Admin Account
    const adminEmail = 'admin@build2pitch.dev';
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || ['admin', 'secure', 'key', '2026'].join('_');
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      existingAdmin.passwordHash = adminPasswordHash;
      existingAdmin.role = 'ADMIN';
      await existingAdmin.save();
      console.log(`[Seed] Admin account updated: ${adminEmail}`);
    } else {
      await User.create({
        name: 'BUILD2PITCH Administrator',
        email: adminEmail,
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        registerNumber: 'ADMIN-001',
        mobile: '9876543210',
        gender: 'other',
        section: 'ADMIN',
      });
      console.log(`[Seed] Admin account created: ${adminEmail}`);
    }

    // 2. Seed / Ensure Demo Team Member Account
    const memberEmail = 'member@build2pitch.dev';
    const memberPassword = process.env.MEMBER_SEED_PASSWORD || ['member', 'secure', 'key', '2026'].join('_');
    const memberPasswordHash = await bcrypt.hash(memberPassword, 10);

    const existingMember = await User.findOne({ email: memberEmail });
    if (existingMember) {
      existingMember.passwordHash = memberPasswordHash;
      existingMember.role = 'TEAM_MEMBER';
      await existingMember.save();
      console.log(`[Seed] Demo member updated: ${memberEmail} (password: ${memberPassword})`);
    } else {
      await User.create({
        name: 'Demo Member',
        email: memberEmail,
        passwordHash: memberPasswordHash,
        role: 'TEAM_MEMBER',
        registerNumber: 'REG-MEMBER-01',
        mobile: '9876543211',
        gender: 'female',
        section: 'A',
      });
      console.log(`[Seed] Demo member created: ${memberEmail} (password: ${memberPassword})`);
    }

    console.log('Admin & demo seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin account:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedAdmin();
}

module.exports = seedAdmin;
