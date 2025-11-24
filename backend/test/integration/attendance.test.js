// test/integration/attendance.test.js
// Top-of-file setup: correct require paths and DB reset before tests run.

const { expect } = require('chai');
const request = require('supertest');

// make sure this path points to your test helper that exports { reset, knex }
// from backend/test/helpers/dbHelper.js (two levels up from this file)
const { reset, knex } = require('../helpers/dbHelper'); // ../helpers from integration folder

// require server only after we reset the DB so server picks up the TEST DB (in-memory)
let app;

before(async function () {
  // ensure TEST_SQLITE_FILE set in test/setup.js via --require test/setup.js
  // reset the test database schema + seed
  await reset();

  // require server after reset so server uses the same knex instance / DB
  // adjust path if your server.js is in a different place
  app = require('../../server'); // two levels up to backend/server.js
});

after(async function () {
  try { await knex.destroy(); } catch (e) { /* ignore */ }
});

// --- rest of your tests follow ---
// e.g.
describe('Attendance Integration Tests', function () {
  it('GET /api/attendance → returns records', async function () {
    const res = await request(app).get('/api/attendance').expect(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /api/attendance → creates attendance record', async function () {
    const payload = { studentId: 1, courseId: 1, date: '2025-01-20', status: 'present', present: 1 };
    await request(app).post('/api/attendance').send(payload).expect(201);
  });
});
