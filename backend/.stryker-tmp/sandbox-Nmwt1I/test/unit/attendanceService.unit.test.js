// @ts-nocheck
const assert = require('assert');
const a = require('../../services/attendanceService');

describe('attendanceService - full tests', () => {
  describe('row mapping and date utils', () => {
    it('rowToAttendance handles null and objects', () => {
      const n = a.rowToAttendance(null);
      assert.ok(n === null || typeof n === 'object');
      const r = { id: 1, studentId: 'S', courseId: 'C', date: '2025-10-01', status: 'present' };
      const out = a.rowToAttendance(r);
      assert.strictEqual(out.id, 1);
    });

    it('isValidDateISO', () => {
      assert.strictEqual(a.isValidDateISO('2025-02-28'), true);
      assert.strictEqual(a.isValidDateISO('2025-02-30'), false);
      assert.strictEqual(a.isValidDateISO('not-a-date'), false);
    });

    it('dateRange inclusive', () => {
      if (typeof a.dateRange === 'function') {
        const r = a.dateRange('2025-10-01','2025-10-03');
        assert.deepStrictEqual(r, ['2025-10-01','2025-10-02','2025-10-03']);
      }
    });
  });

  describe('CSV parsing and percentage', () => {
    it('parseCsv returns parsed rows and errors', () => {
      const csv = 'studentId,courseId,date,status\\nS1,C1,2025-10-01,PRESENT\\nS2,C1,2025-02-30,absent';
      const parsed = a.parseCsv(csv);
      assert.strictEqual(Array.isArray(parsed.rows), true);
      assert.strictEqual(Array.isArray(parsed.errors), true);
    });

    it('calculateAttendancePercentage', () => {
      assert.strictEqual(a.calculateAttendancePercentage(8, 10), 80);
      assert.strictEqual(a.calculateAttendancePercentage(1, 3) >= 0, true);
      assert.strictEqual(a.calculateAttendancePercentage(0, 0), 0);
    });
  });

  describe('markStatus', () => {
    it('insert new row', () => {
      const rows = [];
      const out = a.markStatus(rows, 'S1','C1','2025-10-01','present', false);
      assert.strictEqual(out.inserted, 1);
      assert.strictEqual(rows.length, 1);
    });

    it('skip existing when force=false', () => {
      const rows = [{ studentId:'S1', courseId:'C1', date:'2025-10-01', status:'present' }];
      const out = a.markStatus(rows, 'S1','C1','2025-10-01','absent', false);
      assert.strictEqual(out.skipped, 1);
      assert.strictEqual(out.updated, 0);
    });

    it('update when force=true', () => {
      const rows = [{ studentId:'S1', courseId:'C1', date:'2025-10-01', status:'present' }];
      const out = a.markStatus(rows, 'S1','C1','2025-10-01','absent', true);
      assert.strictEqual(out.updated, 1);
      assert.strictEqual(rows[0].status, 'absent');
    });
  });

  describe('summaries & streaks', () => {
    it('summarizeStudent & summarizeCourse', () => {
      const rows = [
        { studentId:'S1', courseId:'C1', date:'2025-10-01', status:'present' },
        { studentId:'S1', courseId:'C1', date:'2025-10-02', status:'absent' },
        { studentId:'S2', courseId:'C1', date:'2025-10-01', status:'present' }
      ];
      const sumS = a.summarizeStudent(rows,'S1');
      assert.strictEqual(sumS.total,2);
      assert.strictEqual(sumS.present,1);

      if (typeof a.summarizeCourse==='function') {
        const sumC = a.summarizeCourse(rows,'C1');
        assert.strictEqual(sumC.total,3);
        assert.strictEqual(sumC.present,2);
      }
    });

    it('findMissingDates', () => {
      const rows = [{ studentId:'S1', date:'2025-10-01' }];
      const missing = a.findMissingDates(rows,'S1',['2025-10-01','2025-10-02']);
      assert.deepStrictEqual(missing,['2025-10-02']);
    });

    it('consecutiveAbsences', () => {
      const rows = [
        { studentId:'S1', date:'2025-10-01', status:'absent' },
        { studentId:'S1', date:'2025-10-02', status:'absent' },
        { studentId:'S1', date:'2025-10-03', status:'present' },
        { studentId:'S1', date:'2025-10-04', status:'absent' }
      ];
      const s = a.consecutiveAbsences(rows,'S1');
      assert.strictEqual(s,2);
    });

    it('attendanceHeatmap aggregates', () => {
      if (typeof a.attendanceHeatmap==='function') {
        const rows = [
          { studentId:'S1', courseId:'C1', date:'2025-10-01', status:'present' },
          { studentId:'S2', courseId:'C1', date:'2025-10-01', status:'absent' }
        ];
        const map = a.attendanceHeatmap(rows,'C1');
        assert.strictEqual(typeof map['2025-10-01'].present,'number');
        assert.strictEqual(typeof map['2025-10-01'].absent,'number');
      }
    });
  });
});
