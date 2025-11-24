// @ts-nocheck
// test/unit/courseService.unit.test.js
const { expect } = require('chai');
const c = require('../../services/courseService');

describe('courseService', () => {
  it('normalizeCourseCode uppercases and removes spaces', () => {
    expect(c.normalizeCourseCode(' cs 101 ')).to.equal('CS101');
  });

  it('validateCoursePayload fails on missing', () => {
    expect(c.validateCoursePayload(null).ok).to.be.false;
    expect(c.validateCoursePayload({}).ok).to.be.false;
  });

  it('buildCourseRecord builds and defaults credits', () => {
    const rec = c.buildCourseRecord({ code: 'cs101', name: 'Intro' });
    expect(rec.code).to.equal('cs101');
    expect(rec.credits).to.equal(0);
  });
});
