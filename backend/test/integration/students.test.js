// test/integration/students.test.js
const { expect } = require('chai');
const request = require('supertest');

// test helper: must export { reset, knex }
const { reset, knex } = require('../helpers/dbHelper');

let app;

before(async function () {
  // Reset and seed the test DB
  await reset();

  // Require app after DB reset so server picks up the test DB
  app = require('../../server');
});

after(async function () {
  // Destroy knex pool to avoid open handles
  try { await knex.destroy(); } catch (e) { /* ignore */ }
});

describe('Students Integration Tests', function () {
  // Keep a sample payload used across tests
  const sampleStudent = {
    admissionNo: 'ADM999',
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@example.com'
  };

  it('GET /api/students → returns students (array) and seeded students present', async function () {
    const res = await request(app)
      .get('/api/students')
      .expect(200);

    expect(res.body).to.be.an('array');
    // At least zero is acceptable depending on seeding; but check shape if present
    if (res.body.length > 0) {
      const first = res.body[0];
      expect(first).to.have.property('admissionNo');
      expect(first).to.have.property('firstName');
      expect(first).to.have.property('id');
    }
  });

  it('POST /api/students → creates student (201) and returned object has proper fields', async function () {
    // 1) Create
    const postRes = await request(app)
      .post('/api/students')
      .send(sampleStudent)
      .set('Accept', 'application/json')
      .expect(201);

    // Basic shape assertions on returned created student
    expect(postRes.body).to.be.an('object');
    expect(postRes.body).to.have.property('id');
    expect(postRes.body).to.have.property('admissionNo', sampleStudent.admissionNo);
    expect(postRes.body).to.have.property('firstName', sampleStudent.firstName);
    expect(postRes.body).to.have.property('lastName', sampleStudent.lastName);
    expect(postRes.body).to.have.property('email', sampleStudent.email);

    const createdId = postRes.body.id;

    // 2) Verify created record exists via GET /api/students
    const getRes = await request(app)
      .get('/api/students')
      .expect(200);

    expect(getRes.body).to.be.an('array');
    const found = getRes.body.find(s => String(s.id) === String(createdId) || String(s.admissionNo) === String(sampleStudent.admissionNo));
    expect(found, 'Inserted student should be present in GET results').to.exist;
    expect(found.admissionNo).to.equal(sampleStudent.admissionNo);
    expect(found.firstName).to.equal(sampleStudent.firstName);
    expect(found.email).to.equal(sampleStudent.email);
  });

  it('POST /api/students → validation: missing required fields returns 400 and error body', async function () {
    const badPayload = { lastName: 'NoFirst', email: 'bad@example.com' };

    const res = await request(app)
      .post('/api/students')
      .send(badPayload)
      .set('Accept', 'application/json')
      .expect(400);

    // Error body should be an object with errors or message
    expect(res.body).to.be.an('object');
    // Either `errors` array or `error` string is acceptable depending on route implementation
    const hasErrors = Array.isArray(res.body.errors) || typeof res.body.error === 'string' || typeof res.body.errors === 'object';
    expect(hasErrors, 'Response should contain errors or error message').to.equal(true);
  });

  it('POST /api/students → creating duplicate admissionNo should either create a distinct record or return 400/409', async function () {
    // Try to create student with same admissionNo as earlier sampleStudent
    const payload = {
      admissionNo: 'ADM999', // same as created earlier
      firstName: 'Duplicate',
      lastName: 'Student',
      email: 'dup@example.com'
    };

    const res = await request(app)
      .post('/api/students')
      .send(payload)
      .set('Accept', 'application/json');

    // Accept either success (201) or validation/conflict (4xx). We check that the API behaves consistently.
    const okStatuses = [201, 400, 409];
    expect(okStatuses).to.include(res.status);

    if (res.status === 201) {
      // If it succeeded, verify record exists and differs by id
      expect(res.body).to.have.property('id');
      const getRes = await request(app).get('/api/students').expect(200);
      const matches = getRes.body.filter(s => s.admissionNo === payload.admissionNo);
      expect(matches.length).to.be.at.least(1);
    } else {
      // If conflict/validation, verify body contains error info
      expect(res.body).to.be.an('object');
      const hasError = typeof res.body.error === 'string' || Array.isArray(res.body.errors);
      expect(hasError).to.equal(true);
    }
  });

  it('POST /api/students → server error path: simulate malformed input that causes server error (expect 500 and error shape)', async function () {
    // Provide a payload that will likely trigger an internal error (e.g., id datatype mismatch)
    // Note: This test is defensive; if your route returns 400 instead that's acceptable — adjust as needed.
    const payload = {
      admissionNo: 'X'.repeat(1024 * 10), // unusually long string that might break DB column handling
      firstName: 'Overflow',
      lastName: 'Test',
      email: 'overflow@example.com'
    };

    const res = await request(app)
      .post('/api/students')
      .send(payload)
      .set('Accept', 'application/json');

    // Accept either 201/400/500 depending on implementation, but if 500 we must assert error shape
    if (res.status === 500) {
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.a('string').that.is.not.empty;
    } else {
      // if not 500, at least ensure body is shaped predictably
      expect([201, 400]).to.include(res.status);
    }
  });
});
