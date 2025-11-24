// @ts-nocheck
const assert = require('assert');
const e = require('../../services/enrollmentService');

describe('enrollmentService - full tests', () => {
  describe('validation & keys', () => {
    it('validateEnrollment returns ok for good payload', () => {
      assert.strictEqual(e.validateEnrollment({ studentId: 'S1', courseId: 'C1' }).ok, true);
      assert.strictEqual(e.validateEnrollment({}).ok, false);
    });

    it('enrollmentKey produces stable keys', () => {
      assert.strictEqual(e.enrollmentKey('S1','C1'), 'S1::C1');
      assert.strictEqual(typeof e.enrollmentKey('',''), 'string');
    });
  });

  describe('record creation and duplicates', () => {
    it('buildEnrollmentRecord throws when missing', () => {
      assert.throws(() => e.buildEnrollmentRecord({}), Error);
    });

    it('buildEnrollmentRecord returns object when valid', () => {
      const rec = e.buildEnrollmentRecord({
        studentId: 'S1',
        courseId: 'C1',
        enrolledAt: 1600000000000
      });
      assert.strictEqual(rec.studentId, 'S1');
      assert.strictEqual(rec.courseId, 'C1');
      assert.strictEqual(rec.enrolledAt, 1600000000000);
    });

    it('isSameEnrollment checks equality', () => {
      const a = { studentId: 'S1', courseId: 'C1' };
      const b = { studentId: 'S1', courseId: 'C1' };
      const c = { studentId: 'S2', courseId: 'C1' };
      assert.strictEqual(e.isSameEnrollment(a, b), true);
      assert.strictEqual(e.isSameEnrollment(a, c), false);
    });

    it('canEnroll returns false when duplicate', () => {
      const existing = [{ studentId: 'S1', courseId: 'C1' }];
      assert.strictEqual(e.canEnroll(existing, 'S1', 'C1'), false);
      assert.strictEqual(e.canEnroll(existing, 'S1', 'C2'), true);
    });
  });

  describe('bulk helpers', () => {
    it('buildEnrollmentRecords filters invalid entries', () => {
      const list = [
        { studentId: 'S1', courseId: 'C1' },
        { studentId: '', courseId: '' },
        { studentId: 'S2' }
      ];
      const out = e.buildEnrollmentRecords(list);
      assert.ok(Array.isArray(out));
      assert.strictEqual(out.filter(Boolean).length >= 1, true);
      assert.strictEqual(out[0].studentId, 'S1');
    });

    it('removeEnrollmentById removes by id', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const res = e.removeEnrollmentById(arr, 2);
      assert.strictEqual(res.some(x => x.id === 2), false);
      assert.strictEqual(res.length, 2);
    });
  });
});
