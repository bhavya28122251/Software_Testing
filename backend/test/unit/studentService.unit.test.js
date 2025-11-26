const { expect } = require('chai');
const s = require('../../services/studentService');

describe('studentService', () => {
  it('formatFullName trims and joins', () => {
    expect(s.formatFullName(' John ', ' Doe ')).to.equal('John Doe');
    expect(s.formatFullName('', 'Smit')).to.equal('Smit');
    expect(s.formatFullName(null, null)).to.equal('');
  });

  it('validateStudentPayload returns errors for missing fields', () => {
    expect(s.validateStudentPayload(null).valid).to.be.false;
    expect(s.validateStudentPayload({}).valid).to.be.false;
    expect(s.validateStudentPayload({ firstName: 'A' }).valid).to.be.false;
  });

  it('buildStudentRecord produces expected object', async () => {
    const now = 1600000000000;
    const rec = s.buildStudentRecord({ firstName: 'A', lastName: 'B', email: 'a@b.com' }, now);
    expect(rec.firstName).to.equal('A');
    expect(rec.lastName).to.equal('B');
    expect(rec.email).to.equal('a@b.com');
    expect(rec.createdAt).to.equal(now);
  });

  it('rowToStudent maps row correctly', () => {
    const r = { id: '1', firstName: 'X', lastName: 'Y' };
    const out = s.rowToStudent(r);
    expect(out.fullName).to.equal('X Y');
    expect(out.id).to.equal('1');
  });
});
