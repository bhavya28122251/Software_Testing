// @ts-nocheck
const assert = require('assert');
const s = require('../../services/studentService');

describe('studentService - full tests', () => {
  describe('name helpers', () => {
    it('formatFullName: joins properly', () => {
      assert.strictEqual(s.formatFullName('Alice','Smith'), 'Alice Smith');
      assert.strictEqual(s.formatFullName('Alice',''), 'Alice');
      assert.strictEqual(s.formatFullName('', 'Smith'), 'Smith');
      assert.strictEqual(s.formatFullName('', ''), '');
    });

    it('normalizeName: capitalizes parts and trims', () => {
      assert.strictEqual(s.normalizeName('raVi kumar'), 'Ravi Kumar');
      assert.strictEqual(s.normalizeName('  JOHN  '), 'John');
      assert.strictEqual(s.normalizeName(''), '');
    });
  });

  describe('admission & email helpers', () => {
    it('generateAdmissionNo deterministic', () => {
      assert.strictEqual(typeof s.generateAdmissionNo(0), 'string');
      assert.strictEqual(s.generateAdmissionNo(1, 100), 'ADM101');
    });

    it('normalizeEmail and maskEmail', () => {
      assert.strictEqual(s.normalizeEmail('  A@EXAMPLE.COM '), 'a@example.com');
      const m = s.maskEmail('alice@example.com');
      assert.ok(m.includes('@'));
      assert.ok(m.startsWith('a'));
      assert.ok(m.endsWith('@example.com') || m.indexOf('@example.com')>0);
    });
  });

  describe('phone and age', () => {
    it('validatePhone accepts common patterns and rejects invalid', () => {
      assert.strictEqual(s.validatePhone('+919876543210'), true);
      assert.strictEqual(s.validatePhone('9876543210'), true);
      assert.strictEqual(s.validatePhone('+1 234 567 8901'), true);
      assert.strictEqual(s.validatePhone('12345'), false);
      assert.strictEqual(s.validatePhone(''), false);
    });

    it('calculateAge and isAdult behavior', () => {
      const age = s.calculateAge('2000-01-01');
      assert.ok(Number.isFinite(age));
      assert.strictEqual(s.isAdult('2000-01-01', 18), true);
      assert.strictEqual(s.isAdult('2050-01-01', 18), false);
      assert.strictEqual(s.calculateAge('not-a-date'), null);
      assert.strictEqual(s.isAdult('', 18), false);
    });
  });

  describe('payload validation & builders', () => {
    it('validateStudentPayload rejects invalid emails and missing names', () => {
      const v1 = s.validateStudentPayload({ firstName: '', lastName: '' });
      assert.strictEqual(v1.valid, false);
      const v2 = s.validateStudentPayload({ firstName: 'A', lastName: 'B', email: 'bademail' });
      assert.strictEqual(v2.valid, false);
      const v3 = s.validateStudentPayload({ firstName: 'A', lastName: 'B', email: 'a@b.com', phone: '+919876543210' });
      assert.strictEqual(v3.valid, true);
    });

    it('buildStudentRecord sets expected defaults and timestamps', () => {
      const now = 1600000000000;
      const rec = s.buildStudentRecord({ firstName: 'X', lastName: 'Y', email: 'X@Y.COM' }, now);
      assert.strictEqual(rec.firstName, 'X');
      assert.strictEqual(rec.lastName, 'Y');
      assert.strictEqual(rec.email, 'x@y.com');
      assert.strictEqual(rec.createdAt, now);
      assert.strictEqual(rec.updatedAt, now);
    });

    it('rowToStudent null-safety and mapping', () => {
      assert.strictEqual(s.rowToStudent(null), null);
      const row = { id: 5, admissionNo: 'ADM1', firstName: 'A', lastName: 'B', email: 'a@b.com', phone: '123' };
      const out = s.rowToStudent(row);
      assert.strictEqual(out.id, 5);
      assert.strictEqual(out.fullName, 'A B');
      assert.strictEqual(typeof out.emailMasked, 'string');
    });

    it('compareStudents sorts by last then first', () => {
      const a = { firstName: 'B', lastName: 'Alpha' };
      const b = { firstName: 'A', lastName: 'Beta' };
      assert.strictEqual(s.compareStudents(a, b) < 0, true);
      assert.strictEqual(s.compareStudents(b, a) > 0, true);
      const c = { firstName: 'A', lastName: 'Alpha' };
      assert.strictEqual(s.compareStudents(a, c) > 0, true);
    });
  });
});
