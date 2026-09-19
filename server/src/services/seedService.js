const StartupIdea = require('../models/StartupIdea');
const sampleIdeas = require('../seed/ideas');

/**
 * Seeds the default idea pool once, when the collection is empty.
 * Set SEED_ON_BOOT=0 to disable.
 */
async function seedIfEmpty() {
  if (process.env.SEED_ON_BOOT === '0') return false;
  const count = await StartupIdea.estimatedDocumentCount();
  if (count === 0) {
    await StartupIdea.insertMany(sampleIdeas, { ordered: false });
    return true;
  }
  return false;
}

module.exports = { seedIfEmpty };