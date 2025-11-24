// test/integration/enrollment.test.js
const { expect } = require('chai');
const request = require('supertest');
const { reset, knex } = require('../helpers/dbHelper');

let app;

before(async function () {
  await reset();
  app = require('../../server');
});

after(async function () {
  try { await knex.destroy(); } catch (e) { /* ignore */ }
});

describe('Enrollments Integration Tests', function () {
  it('GET /api/enroll → returns enrollments (array)', async function () {
    const res = await request(app).get('/api/enroll').expect(200);
    expect(res.body).to.be.an('array');
    // seed may have one enrollment
    expect(res.body.length).to.be.at.least(0);
  });

  it('POST /api/enroll → creates enrollment (201)', async function () {
    // ensure studentId and courseId exist in seeded DB (dbHelper should seed them)
    const payload = { studentId: 1, courseId: 1, semester: '2025-01' };

    const postRes = await request(app)
      .post('/api/enroll')
      .send(payload)
      .set('Accept', 'application/json')
      // some implementations return 201; if your route returns 200 adjust test or route accordingly
      .expect(201);

    expect(postRes.body).to.be.an('object');
    // verify creation by listing enrollments
    const getRes = await request(app).get('/api/enroll').expect(200);
    const found = getRes.body.find(e =>
      Number(e.studentId) === Number(payload.studentId) &&
      Number(e.courseId) === Number(payload.courseId) &&
      String(e.semester) === String(payload.semester)
    );
    expect(found, 'Inserted enrollment should be present').to.exist;
  });
});
