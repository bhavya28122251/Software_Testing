// test/unit/enrollmentService.unit.test.js
const { expect } = require('chai');
const e = require('../../services/enrollmentService');

describe('enrollmentService', () => {
  it('validateEnrollment fails without ids', () => {
    expect(e.validateEnrollment(null).ok).to.be.false;
    expect(e.validateEnrollment({}).ok).to.be.false;
  });

  it('buildEnrollmentRecord builds object', () => {
    const rec = e.buildEnrollmentRecord({ studentId: 'S1', courseId: 'C1' });
    expect(rec.studentId).to.equal('S1');
    expect(rec.courseId).to.equal('C1');
    expect(rec.enrolledAt).to.be.a('number');
  });
});
