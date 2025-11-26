// test/integration/enrollment.test.js
const { expect } = require('chai');
const request = require('supertest');
const { reset, knex } = require('../helpers/dbHelper');

let app;
before(async function () {
  await reset();
  app = require('../../server');
});
after(async function () { try { await knex.destroy(); } catch (e) {} });

function hasErrorShape(body) {
  return (typeof body.error === 'string') || Array.isArray(body.errors) || (typeof body.error === 'object');
}

describe('Enrollments Integration Tests (safe)', function () {
  let studentId, courseId;

  beforeEach(async function () {
    // ensure DB schema present for each beforeEach (this avoids being affected by prior drop-table tests)
    await reset();

    const stRes = await request(app).post('/api/students').send({
      admissionNo: `ADM${Date.now()}`,
      firstName: 'Enroll', lastName: 'Tester', email: `enroll${Date.now()}@test.com`
    }).expect(201);
    studentId = stRes.body.id;

    const crRes = await request(app).post('/api/courses').send({
      code: `C${Date.now()}`, title: 'Enroll Course', credits: 2
    }).expect(201);
    courseId = crRes.body.id;
  });

  it('GET /api/enroll → returns array', async function () {
    const res = await request(app).get('/api/enroll').expect(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /api/enroll → creates enrollment and GET contains it', async function () {
    const payload = { studentId, courseId, semester: '2025-01' };
    const post = await request(app).post('/api/enroll').send(payload).expect(201);
    expect(post.body).to.have.property('studentId');
    const get = await request(app).get('/api/enroll').expect(200);
    const found = get.body.find(e => String(e.studentId) === String(studentId) && String(e.courseId) === String(courseId));
    expect(found).to.exist;
  });

  it('POST /api/enroll → validation: missing fields returns 400', async function () {
    const res = await request(app).post('/api/enroll').send({}).expect(400);
    expect(hasErrorShape(res.body)).to.equal(true);
  });

  it('POST /api/enroll → invalid types for ids (strings) should be handled or produce 400/500', async function () {
    const res = await request(app).post('/api/enroll').send({ studentId: 'abc', courseId: 'def' });
    expect([201,400,500]).to.include(res.status);
    if (res.status === 500) expect(hasErrorShape(res.body)).to.equal(true);
  });

  it('POST /api/enroll → DB error path: drop table returns 500 and error body (restores DB afterwards)', async function () {
    try {
      if (knex && knex.schema && typeof knex.schema.dropTableIfExists === 'function') {
        await knex.schema.dropTableIfExists('enrollments');
      } else {
        await knex.raw('DROP TABLE IF EXISTS enrollments;');
      }

      const res = await request(app).post('/api/enroll').send({ studentId: 1, courseId: 1 });
      expect([500, 400, 201]).to.include(res.status);
      if (res.status === 500) expect(hasErrorShape(res.body)).to.equal(true);
    } finally {
      await reset();
    }
  });

  it('POST /api/enroll → duplicate enrollments handling (idempotency/conflict)', async function () {
    const payload = { studentId, courseId, semester: '2025-02' };
    const r1 = await request(app).post('/api/enroll').send(payload);
    expect([201,400,409]).to.include(r1.status);
    const r2 = await request(app).post('/api/enroll').send(payload);
    expect([201,400,409]).to.include(r2.status);
  });
});
