// backend/test/setup.js
// Required by mocha via --require to set up environment early.
// Keep this minimal: set TEST_SQLITE_FILE and ensure knex is destroyed on exit.
// Do NOT call knex.init() here — tests call reset() and will recreate schema.

process.env.TEST_SQLITE_FILE = ':memory:';

const knex = require('../db');

// Don't call knex.init() here to avoid duplicate table creation when tests call reset().
// If you need global init, place it in a single location only.

process.once('beforeExit', () => {
  if (knex && typeof knex.destroy === 'function') {
    knex.destroy().catch(() => {});
  }
});
