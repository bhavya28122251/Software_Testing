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

describe('Enrollments Integration Tests', function () {
  // We will create a course and a student first to enroll them
  let studentId, courseId;
  beforeEach(async function () {
    // Create student
    const stRes = await request(app).post('/api/students').send({
      admissionNo: `ADM${Date.now()}`,
      firstName: 'Enroll',
      lastName: 'Tester',
      email: `enroll${Date.now()}@test.com`
    }).expect(201);
    studentId = stRes.body.id || stRes.body && stRes.body.id;

    // Create course
    const crRes = await request(app).post('/api/courses').send({
      code: `C${Date.now()}`,
      title: 'Enroll Course',
      credits: 2
    }).expect(201);
    courseId = crRes.body.id || crRes.body && crRes.body.id;
  });

  it('GET /api/enroll → returns array', async function () {
    const res = await request(app).get('/api/enroll').expect(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /api/enroll → creates enrollment (201) and GET contains it', async function () {
    const payload = { studentId, courseId, semester: '2025-01' };
    const postRes = await request(app).post('/api/enroll').send(payload).expect(201);

    expect(postRes.body).to.be.an('object');
    // created row must have studentId and courseId
    expect(postRes.body).to.have.property('studentId');
    expect(String(postRes.body.studentId)).to.equal(String(studentId));
    expect(String(postRes.body.courseId)).to.equal(String(courseId));

    // Verify via GET
    const getRes = await request(app).get('/api/enroll').expect(200);
    const found = getRes.body.find(e => String(e.studentId) === String(studentId) && String(e.courseId) === String(courseId));
    expect(found, 'Inserted enrollment should be present in GET results').to.exist;
    expect(found.semester).to.equal('2025-01');
  });

  it('POST /api/enroll → validation: missing fields returns 400', async function () {
    const res = await request(app).post('/api/enroll').send({}).expect(400);
    expect(res.body).to.be.an('object');
    const hasError = typeof res.body.error === 'string' || Array.isArray(res.body.errors);
    expect(hasError).to.equal(true);
  });

  it('POST /api/enroll → server error path (invalid id types) should surface 500 if thrown', async function () {
    // Use invalid types that may cause db error
    const res = await request(app).post('/api/enroll').send({ studentId: 'not-a-number', courseId: 'not-a-number' });
    if (res.status === 500) {
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.a('string');
    } else {
      expect([400, 201]).to.include(res.status);
    }
  });
});
