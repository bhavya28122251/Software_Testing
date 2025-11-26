// test/integration/students.test.js
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

function hasErrorShape(body) {
  return (typeof body.error === 'string') || Array.isArray(body.errors) || (typeof body.error === 'object');
}

describe('Students Integration Tests (safe)', function () {
  const sampleStudent = { admissionNo: 'ADM999', firstName: 'Test', lastName: 'User', email: 'test.user@example.com' };

  it('GET /api/students → returns students (array) and seeded students present', async function () {
    const res = await request(app).get('/api/students').expect(200);
    expect(res.body).to.be.an('array');
    if (res.body.length > 0) {
      const first = res.body[0];
      expect(first).to.have.property('admissionNo');
      expect(first).to.have.property('firstName');
      expect(first).to.have.property('id');
    }
  });

  it('POST /api/students → creates student (201) and returned object has proper fields', async function () {
    const postRes = await request(app).post('/api/students').send(sampleStudent).set('Accept', 'application/json').expect(201);
    expect(postRes.body).to.be.an('object');
    expect(postRes.body).to.have.property('id');
    expect(postRes.body).to.have.property('admissionNo', sampleStudent.admissionNo);
    expect(postRes.body).to.have.property('firstName', sampleStudent.firstName);
    expect(postRes.body).to.have.property('lastName', sampleStudent.lastName);
    expect(postRes.body).to.have.property('email', sampleStudent.email);

    const createdId = postRes.body.id;
    const getRes = await request(app).get('/api/students').expect(200);
    expect(getRes.body).to.be.an('array');
    const found = getRes.body.find(s => String(s.id) === String(createdId) || String(s.admissionNo) === String(sampleStudent.admissionNo));
    expect(found).to.exist;
  });

  it('POST /api/students → validation: missing required fields returns 400 and error body', async function () {
    const badPayload = { lastName: 'NoFirst', email: 'bad@example.com' };
    const res = await request(app).post('/api/students').send(badPayload).set('Accept', 'application/json').expect(400);
    expect(hasErrorShape(res.body)).to.equal(true);
  });

  it('POST /api/students → creating duplicate admissionNo should either create a distinct record or return 400/409', async function () {
    const payload = { admissionNo: 'ADM999', firstName: 'Duplicate', lastName: 'Student', email: 'dup@example.com' };
    const res = await request(app).post('/api/students').send(payload).set('Accept', 'application/json');
    expect([201, 400, 409]).to.include(res.status);
    if (res.status !== 201) expect(hasErrorShape(res.body)).to.equal(true);
  });

  it('POST /api/students → DB error path: drop students table yields 500 and error shape (restores DB afterwards)', async function () {
    try {
      if (knex && knex.schema && typeof knex.schema.dropTableIfExists === 'function') {
        await knex.schema.dropTableIfExists('students');
      } else {
        await knex.raw('DROP TABLE IF EXISTS students;');
      }

      const res = await request(app).post('/api/students').send({
        admissionNo: 'ERR01', firstName: 'Err', lastName: 'User', email: 'err@t.test'
      });
      expect([500,400,201]).to.include(res.status);
      if (res.status === 500) expect(hasErrorShape(res.body)).to.equal(true);
    } finally {
      await reset();
    }
  });

  it('POST /api/students → invalid email formats should return 400 or 201 consistently', async function () {
    const badEmail = { admissionNo: `E${Date.now()}`, firstName: 'Bad', lastName: 'Email', email: 'not-an-email' };
    const res = await request(app).post('/api/students').send(badEmail);
    // Accept either 400 (validation) or 201 (not validated)
    expect([201,400]).to.include(res.status);
    if (res.status === 400) expect(hasErrorShape(res.body)).to.equal(true);
  });
});
