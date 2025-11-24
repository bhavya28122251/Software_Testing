// test/integration/courses.test.js
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
  try { await knex.destroy(); } catch (e) { /* ignore */ }
});

describe('Courses Integration Tests', function () {
  it('GET /api/courses → returns courses (array)', async function () {
    const res = await request(app)
      .get('/api/courses')
      .expect(200);

    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.at.least(1);

    const first = res.body[0];
    expect(first).to.have.property('code');
    expect(first).to.have.property('title');
  });

  it('POST /api/courses → creates course (201)', async function () {
    const payload = { code: 'CS202', title: 'Algorithms', credits: 4 };

    const postRes = await request(app)
      .post('/api/courses')
      .send(payload)
      .set('Accept', 'application/json')
      .expect(201);

    expect(postRes.body).to.be.an('object');
    if (postRes.body.id !== undefined && postRes.body.id !== null) {
      expect(postRes.body.id).to.satisfy((v) => typeof v === 'number' || typeof v === 'string');
    }

    // verify created course appears
    const getRes = await request(app)
      .get('/api/courses')
      .expect(200);

    const found = getRes.body.find(c => String(c.code) === String(payload.code) && String(c.title) === String(payload.title));
    expect(found, 'Inserted course should be present in GET results').to.exist;
  });
});
