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

describe('Courses Integration Tests', function () {
  // Use a unique code per run to avoid collisions with seeded data
  const sampleCourse = {
    code: `CS101-${Date.now()}`,
    title: 'Intro to Computer Science',
    credits: 3
  };

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
    const post = await request(app)
      .post('/api/courses')
      .send(sampleCourse)
      .expect(201);

    expect(post.body).to.have.property('id');
    expect(post.body.code).to.equal(sampleCourse.code);
    expect(post.body.title).to.equal(sampleCourse.title);

    if (post.body.credits !== undefined && post.body.credits !== null) {
      expect(Number(post.body.credits)).to.equal(sampleCourse.credits);
    }

    const all = await request(app).get('/api/courses').expect(200);
    const found = all.body.find(
      c => String(c.id) === String(post.body.id) || c.code === sampleCourse.code
    );

    expect(found).to.exist;
    expect(found.title).to.equal(sampleCourse.title);
  });

  it('POST /api/courses → validation: missing title or code returns 400', async function () {
    const res = await request(app)
      .post('/api/courses')
      .send({ code: '', title: '' })
      .expect(400);

    const hasError =
      typeof res.body.error === 'string' || Array.isArray(res.body.errors);

    expect(hasError).to.equal(true);
  });

  it('POST /api/courses → server error path (malformed input)', async function () {
    const bad = { code: 'X'.repeat(5000), title: 'Bad' };
    const res = await request(app).post('/api/courses').send(bad);

    if (res.status === 500) {
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.a('string').and.not.empty;
    } else {
      expect([201, 400]).to.include(res.status);
    }
  });
});
