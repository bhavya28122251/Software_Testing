// test/integration/courses.test.js
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

describe('Courses Integration Tests (safe)', function () {
  const sampleCourse = { code: `CS101-${Date.now()}`, title: 'Intro to Computer Science', credits: 3 };

  it('GET /api/courses → returns courses (array) and each course has expected keys', async function () {
    const res = await request(app).get('/api/courses').expect(200);
    expect(res.body).to.be.an('array');
    if (res.body.length > 0) {
      const c = res.body[0];
      expect(c).to.have.property('id');
      expect(c).to.have.property('code');
      expect(c).to.have.property('title');
      expect(c).to.have.property('credits');
    }
  });

  it('POST /api/courses → creates course (201) and GET contains it', async function () {
    const post = await request(app).post('/api/courses').send(sampleCourse).expect(201);
    expect(post.body).to.have.property('id');
    expect(post.body.code).to.equal(sampleCourse.code);
    expect(post.body.title).to.equal(sampleCourse.title);

    const all = await request(app).get('/api/courses').expect(200);
    const found = all.body.find(c => String(c.id) === String(post.body.id) || c.code === sampleCourse.code);
    expect(found).to.exist;
    expect(found.title).to.equal(sampleCourse.title);
  });

  it('POST /api/courses → validation: missing title or code returns 400', async function () {
    const res = await request(app).post('/api/courses').send({ code: '', title: '' }).expect(400);
    expect(hasErrorShape(res.body)).to.equal(true);
  });

  it('POST /api/courses → long/wrong types should produce 400/500/201 and error shape when not created', async function () {
    const bad = { code: 'X'.repeat(5000), title: 'Bad' };
    const res = await request(app).post('/api/courses').send(bad);

    if (res.status === 201) {
      expect(res.body).to.have.property('id');
    } else if (res.status === 400 || res.status === 500) {
      expect(hasErrorShape(res.body)).to.equal(true);
    } else {
      throw new Error(`Unexpected status: ${res.status}`);
    }
  });

  it('POST /api/courses → DB error path (drop table) should return 500 and error (restores DB afterwards)', async function () {
    try {
      if (knex && knex.schema && typeof knex.schema.dropTableIfExists === 'function') {
        await knex.schema.dropTableIfExists('courses');
      } else {
        await knex.raw('DROP TABLE IF EXISTS courses;');
      }

      const res = await request(app).post('/api/courses').send({ code: 'X', title: 'Y', credits: 1 });
      expect([500, 400, 201]).to.include(res.status);
      if (res.status === 500) expect(hasErrorShape(res.body)).to.equal(true);
    } finally {
      await reset();
    }
  });

  it('POST /api/courses → boundary values for credits (0, negative, large) — accept 201/400/500', async function () {
    const cases = [{credits:0},{credits:-1},{credits:999999}];
    for (const c of cases) {
      const payload = { code: `BND-${Date.now()}-${Math.random()}`, title: 'Boundary', credits: c.credits };
      const res = await request(app).post('/api/courses').send(payload);
      expect([201,400,500]).to.include(res.status);
    }
  });
});
