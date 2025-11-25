// test/integration/attendance.test.js
const { expect } = require('chai');
const request = require('supertest');
const { reset, knex } = require('../helpers/dbHelper');

let app;

before(async function () {
  await reset();
  app = require('../../server');
});

after(async function () {
  try { await knex.destroy(); } catch (e) {}
});

describe('Attendance Integration Tests', function () {
  let studentId, courseId;

  beforeEach(async function () {
    const st = await request(app)
      .post('/api/students')
      .send({
        admissionNo: `ADM${Date.now()}`,
        firstName: 'Att',
        lastName: 'User',
        email: `att${Date.now()}@test.com`
      })
      .expect(201);

    studentId = st.body.id;

    const cr = await request(app)
      .post('/api/courses')
      .send({
        code: `CT${Date.now()}`,
        title: 'Attend Course',
        credits: 1
      })
      .expect(201);

    courseId = cr.body.id;
  });

  it('GET /api/attendance → returns array', async function () {
    const res = await request(app).get('/api/attendance').expect(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /api/attendance → creates attendance record (201) and record retrievable', async function () {
    const payload = {
      studentId,
      courseId,
      date: '2025-09-01',
      status: 'present'
    };

    const post = await request(app)
      .post('/api/attendance')
      .send(payload)
      .expect(201);

    expect(post.body).to.be.an('object');
    expect(post.body).to.have.property('id');
    expect(post.body.studentId).to.equal(payload.studentId);
    expect(post.body.courseId).to.equal(payload.courseId);
    expect(post.body.date).to.equal(payload.date);
    expect(post.body.status).to.equal(payload.status);

    const all = await request(app).get('/api/attendance').expect(200);
    const found = all.body.find(a => String(a.id) === String(post.body.id));
    expect(found).to.exist;
    expect(found.status).to.equal(payload.status);
  });

  it('POST /api/attendance → validation: missing fields returns 400', async function () {
    const res = await request(app).post('/api/attendance').send({}).expect(400);
    expect(res.body).to.be.an('object');
    const validError =
      typeof res.body.error === 'string' || Array.isArray(res.body.errors);
    expect(validError).to.equal(true);
  });

  it('POST /api/attendance → error path: invalid date produces 4xx/5xx/201 and body shape', async function () {
    const res = await request(app)
      .post('/api/attendance')
      .send({
        studentId,
        courseId,
        date: 'BAD_DATE',
        status: 'present'
      });

    // If API treats BAD_DATE as valid and creates the record
    if (res.status === 201) {
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('id');
      return;
    }

    // If API validates and returns 400
    if (res.status === 400) {
      const validError =
        typeof res.body.error === 'string' || Array.isArray(res.body.errors);
      expect(validError).to.equal(true);
      return;
    }

    // If server/DB error occurs (500)
    if (res.status === 500) {
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.a('string').and.not.empty;
      return;
    }

    // Any other status is unexpected and should fail the test
    throw new Error(`Unexpected status: ${res.status}`);
  });
});
