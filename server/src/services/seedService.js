const bcrypt = require('bcryptjs');
const StartupIdea = require('../models/StartupIdea');
const EventSettings = require('../models/EventSettings');
const User = require('../models/User');
const sampleIdeas = require('../seed/ideas');

/**
 * Seeds the default idea pool + event settings + admin user once,
 * when the respective collections are empty.
 * Set SEED_ON_BOOT=0 to disable.
 */
async function seedIfEmpty() {
  if (process.env.SEED_ON_BOOT === '0') return false;

  let didSeed = false;

  // 1. Seed startup ideas
  const ideaCount = await StartupIdea.estimatedDocumentCount();
  if (ideaCount === 0) {
    const ideasWithDefaults = sampleIdeas.map((idea) => ({
      ...idea,
      isActive: true,
      isAssigned: false,
      assignedTeamId: null,
      difficulty: idea.difficulty || 'intermediate',
    }));
    await StartupIdea.insertMany(ideasWithDefaults, { ordered: false });
    console.log(`[Seed] Inserted ${ideasWithDefaults.length} startup ideas`);
    didSeed = true;
  }

  // 2. Seed default EventSettings
  const eventCount = await EventSettings.estimatedDocumentCount();
  if (eventCount === 0) {
    // Event date: 2026-09-23, 9 AM IST
    const eventStart = new Date('2026-09-23T03:30:00.000Z'); // 9:00 AM IST
    const eventEnd = new Date('2026-09-23T14:30:00.000Z');   // 8:00 PM IST

    await EventSettings.create({
      eventName: 'Build2Pitch',
      tagline: "Shape What's Next.",
      startTime: eventStart,
      endTime: eventEnd,
      registrationOpen: true,
      challengeOpen: true,
      submissionOpen: true,
      maxTeamSize: 6,
      maxIdeaAttempts: 2,
    });
    console.log('[Seed] Event settings created');
    didSeed = true;
  }

  // 3. Seed default admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nextgen.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@2026';
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: 'Event Admin',
      email: adminEmail,
      registerNumber: 'ADMIN-001',
      mobile: '9999999999',
      gender: 'OTHER',
      section: 'ADMIN',
      passwordHash,
      role: 'ADMIN',
      isActive: true,
    });
    console.log(`[Seed] Admin user created: ${adminEmail} / ${adminPassword}`);
    didSeed = true;
  }

  return didSeed;
}

module.exports = { seedIfEmpty };