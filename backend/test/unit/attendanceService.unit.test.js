// test/unit/attendanceService.unit.test.js
const { expect } = require('chai');
const a = require('../../services/attendanceService');

describe('attendanceService', () => {
  it('isValidDateISO detects valid/invalid', () => {
    expect(a.isValidDateISO('2025-10-01')).to.be.true;
    expect(a.isValidDateISO('2025-13-01')).to.be.false;
    expect(a.isValidDateISO('not-a-date')).to.be.false;
  });

  it('parseCsv parses good CSV and reports errors for bad', () => {
    const csv = 'studentId,courseId,date,status\nS1,C1,2025-10-01,present\nS2,C2,2025-10-02,absent';
    const { rows, errors } = a.parseCsv(csv);
    expect(errors.length).to.equal(0);
    expect(rows.length).to.equal(2);
    const bad = 'studentId,courseId,date,status\nS1,,2025-10-01,present';
    const r2 = a.parseCsv(bad);
    expect(r2.errors.length).to.be.greaterThan(0);
  });

  it('calculateAttendancePercentage returns rounded percent', () => {
    expect(a.calculateAttendancePercentage(8, 10)).to.equal(80);
    expect(a.calculateAttendancePercentage(0, 0)).to.equal(0);
  });
});
