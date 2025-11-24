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
  try { await knex.destroy(); } catch (e) { /* ignore */ }
});

describe('Students Integration Tests', function () {
  it('GET /api/students → returns students (array)', async function () {
    const res = await request(app).get('/api/students').expect(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.at.least(1);
    const first = res.body[0];
    expect(first).to.have.property('admissionNo');
    expect(first).to.have.property('firstName');
  });

  it('POST /api/students → creates student (201)', async function () {
    const payload = { admissionNo: 'ADM999', firstName: 'Test', lastName: 'User', email: 't@u.com' };

    const postRes = await request(app)
      .post('/api/students')
      .send(payload)
      .set('Accept', 'application/json')
      .expect(201);

    expect(postRes.body).to.be.an('object');
    if (postRes.body.id !== undefined && postRes.body.id !== null) {
      expect(postRes.body.id).to.satisfy((v) => typeof v === 'number' || typeof v === 'string');
    }

    const getRes = await request(app).get('/api/students').expect(200);
    const found = getRes.body.find(s => String(s.admissionNo) === String(payload.admissionNo));
    expect(found, 'Inserted student should be present').to.exist;
  });
});
