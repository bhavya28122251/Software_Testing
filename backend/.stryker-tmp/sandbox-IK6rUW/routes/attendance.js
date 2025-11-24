// @ts-nocheck
// routes/attendance.js (updated to use services/attendanceService)
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const dbModule = require('../db');
const attendanceService = require('../services/attendanceService');
const router = express.Router();

/**
 * GET /api/attendance
 * query params: studentId, courseId, date, page, limit
 */
router.get('/', async (req, res) => {
  try {
    const studentId = req.query.studentId;
    const courseId = req.query.courseId;
    const date = req.query.date;
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, Math.min(200, parseInt(req.query.limit || '100', 10)));
    const offset = (page - 1) * limit;
    const db = dbModule.getDb();

    const clauses = [];
    const params = [];
    if (studentId) { clauses.push('studentId = ?'); params.push(studentId); }
    if (courseId)  { clauses.push('courseId = ?');  params.push(courseId); }
    if (date)      { clauses.push('date = ?');      params.push(date); }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const rows = await db.all(`SELECT * FROM attendance ${where} ORDER BY date DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
    res.json({ page, limit, results: rows.map(attendanceService.rowToAttendance) });
  } catch (err) {
    console.error('GET /api/attendance error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/attendance
 */
router.post('/', async (req, res) => {
  try {
    const raw = req.body || {};
    const studentId = (raw.studentId || '').toString().trim();
    const courseId = (raw.courseId || '').toString().trim();
    const date = (raw.date || '').toString().trim();
    const status = (raw.status || 'present').toString().trim().toLowerCase();
    const force = req.query.force === 'true';

    if (!studentId || !courseId || !date) return res.status(400).json({ error: 'studentId, courseId and date required' });
    if (!attendanceService.isValidDateISO(date)) return res.status(400).json({ error: 'date must be YYYY-MM-DD' });
    if (!['present','absent'].includes(status)) return res.status(400).json({ error: 'status must be present or absent' });

    const db = dbModule.getDb();
    const s = await db.get('SELECT id FROM students WHERE id = ?', [studentId]);
    const c = await db.get('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (!s || !c) return res.status(400).json({ error: 'studentId or courseId invalid' });

    const dup = await db.get('SELECT id FROM attendance WHERE studentId = ? AND courseId = ? AND date = ?', [studentId, courseId, date]);
    if (dup && !force) return res.status(409).json({ error: 'attendance already exists for this student/course/date', id: dup.id });

    const id = uuidv4();
    await db.run('INSERT INTO attendance (id, studentId, courseId, date, status) VALUES (?, ?, ?, ?, ?)', [id, studentId, courseId, date, status]);
    res.status(201).json({ id, studentId, courseId, date, status });
  } catch (err) {
    console.error('POST /api/attendance error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/attendance/:id
 */
router.patch('/:id', async (req, res) => {
  try {
    const db = dbModule.getDb();
    const existing = await db.get('SELECT * FROM attendance WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const raw = req.body || {};
    const updated = { ...existing };
    if (raw.status !== undefined) {
      const s = raw.status.toString().trim().toLowerCase();
      if (!['present','absent'].includes(s)) return res.status(400).json({ error: 'status must be present or absent' });
      updated.status = s;
    }
    if (raw.date !== undefined) {
      const d = raw.date.toString().trim();
      if (!attendanceService.isValidDateISO(d)) return res.status(400).json({ error: 'date must be YYYY-MM-DD' });
      const dup = await db.get('SELECT id FROM attendance WHERE studentId = ? AND courseId = ? AND date = ? AND id != ?', [existing.studentId, existing.courseId, d, existing.id]);
      if (dup) return res.status(409).json({ error: 'another attendance record exists for this student/course/date', id: dup.id });
      updated.date = d;
    }

    await db.run('UPDATE attendance SET date=?, status=? WHERE id=?', [updated.date, updated.status, req.params.id]);
    res.json(attendanceService.rowToAttendance(updated));
  } catch (err) {
    console.error('PATCH /api/attendance/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/attendance/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const db = dbModule.getDb();
    const info = await db.run('DELETE FROM attendance WHERE id = ?', [req.params.id]);
    res.json({ success: info.changes > 0 });
  } catch (err) {
    console.error('DELETE /api/attendance/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/attendance/upload-csv
 */
router.post('/upload-csv', async (req, res) => {
  try {
    const raw = req.body || {};
    const csvText = (raw.csv || '').toString();
    const force = req.query.force === 'true';
    if (!csvText) return res.status(400).json({ error: 'csv body required (key: csv)' });

    const { rows, errors: parseErrors } = attendanceService.parseCsv(csvText);
    if (parseErrors.length) return res.status(400).json({ error: 'CSV parse errors', details: parseErrors });

    const db = dbModule.getDb();
    let inserted = 0;
    let skipped = 0;
    const rowErrors = [];

    await db.transaction(async (tx) => {
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const s = await tx.get('SELECT id FROM students WHERE id = ?', [r.studentId]);
        const c = await tx.get('SELECT id FROM courses WHERE id = ?', [r.courseId]);
        if (!s || !c) {
          rowErrors.push({ line: i+2, error: 'studentId or courseId not found' });
          continue;
        }
        const dup = await tx.get('SELECT id FROM attendance WHERE studentId = ? AND courseId = ? AND date = ?', [r.studentId, r.courseId, r.date]);
        if (dup && !force) {
          skipped++;
          continue;
        }
        if (dup && force) {
          await tx.run('UPDATE attendance SET status = ? WHERE id = ?', [r.status, dup.id]);
          inserted++;
          continue;
        }
        const id = uuidv4();
        await tx.run('INSERT INTO attendance (id, studentId, courseId, date, status) VALUES (?, ?, ?, ?, ?)', [id, r.studentId, r.courseId, r.date, r.status]);
        inserted++;
      }
    })();

    res.json({ inserted, skipped, rowErrors });
  } catch (err) {
    console.error('POST /api/attendance/upload-csv error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/attendance/export
 */
router.get('/export', async (req, res) => {
  try {
    const studentId = req.query.studentId;
    const courseId = req.query.courseId;
    const date = req.query.date;
    const db = dbModule.getDb();

    const clauses = [];
    const params = [];
    if (studentId) { clauses.push('studentId = ?'); params.push(studentId); }
    if (courseId)  { clauses.push('courseId = ?');  params.push(courseId); }
    if (date)      { clauses.push('date = ?');      params.push(date); }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

    const rows = await db.all(`SELECT * FROM attendance ${where} ORDER BY date DESC`, params);
    const header = ['id','studentId','courseId','date','status'];
    const csv = [
      header.join(',')
    ].concat(rows.map(r => header.map(k => {
      let v = r[k];
      if (v === null || v === undefined) return '';
      v = String(v);
      if (v.includes('"')) v = v.replace(/"/g, '""');
      if (v.includes(',') || v.includes('"') || v.includes('\n')) return `"${v}"`;
      return v;
    }).join(','))).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');
    res.send(csv);
  } catch (err) {
    console.error('GET /api/attendance/export error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/attendance/summary/student/:studentId
 */
router.get('/summary/student/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const db = dbModule.getDb();
    const courses = await db.all(
      `SELECT c.id AS courseId, c.name AS courseName
       FROM courses c
       LEFT JOIN enrollments e ON e.courseId = c.id AND e.studentId = ?
       WHERE e.studentId = ? OR EXISTS (SELECT 1 FROM attendance a WHERE a.courseId = c.id AND a.studentId = ?)
       GROUP BY c.id`, [studentId, studentId, studentId]
    );

    const out = [];
    for (const c of courses) {
      const totalRow = await db.get('SELECT COUNT(*) AS cnt FROM attendance WHERE studentId = ? AND courseId = ?', [studentId, c.courseId]);
      const presentRow = await db.get("SELECT COUNT(*) AS cnt FROM attendance WHERE studentId = ? AND courseId = ? AND status = 'present'", [studentId, c.courseId]);
      const total = totalRow ? Number(totalRow.cnt) : 0;
      const present = presentRow ? Number(presentRow.cnt) : 0;
      const percentage = total === 0 ? 0 : (present / total) * 100;
      out.push({ courseId: c.courseId, courseName: c.courseName || '', presentCount: present, totalCount: total, percentage: Number(percentage.toFixed(2)) });
    }
    res.json(out);
  } catch (err) {
    console.error('GET /api/attendance/summary/student/:studentId error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/attendance/summary/course/:courseId
 */
router.get('/summary/course/:courseId', async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const db = dbModule.getDb();

    const students = await db.all(
      `SELECT s.id AS studentId, (s.firstName || ' ' || s.lastName) AS studentName
       FROM students s
       LEFT JOIN enrollments e ON e.studentId = s.id AND e.courseId = ?
       WHERE e.courseId = ? OR EXISTS (SELECT 1 FROM attendance a WHERE a.studentId = s.id AND a.courseId = ?)
       GROUP BY s.id`, [courseId, courseId, courseId]
    );

    const out = [];
    for (const s of students) {
      const totalRow = await db.get('SELECT COUNT(*) AS cnt FROM attendance WHERE studentId = ? AND courseId = ?', [s.studentId, courseId]);
      const presentRow = await db.get("SELECT COUNT(*) AS cnt FROM attendance WHERE studentId = ? AND courseId = ? AND status = 'present'", [s.studentId, courseId]);
      const total = totalRow ? Number(totalRow.cnt) : 0;
      const present = presentRow ? Number(presentRow.cnt) : 0;
      const percentage = total === 0 ? 0 : (present / total) * 100;
      out.push({ studentId: s.studentId, studentName: s.studentName || '', presentCount: present, totalCount: total, percentage: Number(percentage.toFixed(2)) });
    }
    res.json(out);
  } catch (err) {
    console.error('GET /api/attendance/summary/course/:courseId error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/attendance/monthly-report
 */
router.get('/monthly-report', async (req, res) => {
  try {
    const year = parseInt(req.query.year || '', 10);
    const month = parseInt(req.query.month || '', 10);
    const courseId = req.query.courseId;
    if (!year || !month || month < 1 || month > 12) return res.status(400).json({ error: 'year and month required (month 1-12)' });

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));
    const startStr = start.toISOString().slice(0, 10);
    const endStr = new Date(end.getTime() - 1).toISOString().slice(0, 10);

    const db = dbModule.getDb();
    const clauses = ['date >= ?','date <= ?'];
    const params = [startStr, endStr];
    if (courseId) { clauses.push('courseId = ?'); params.push(courseId); }
    const where = `WHERE ${clauses.join(' AND ')}`;

    const rows = await db.all(`
      SELECT date,
             SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) AS present,
             SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) AS absent,
             COUNT(*) AS total
      FROM attendance
      ${where}
      GROUP BY date
      ORDER BY date ASC
    `, params);

    const map = {};
    for (const r of rows) {
      map[r.date] = { date: r.date, present: Number(r.present), absent: Number(r.absent), total: Number(r.total) };
    }

    const out = [];
    let cur = new Date(start);
    while (cur < end) {
      const dstr = cur.toISOString().slice(0,10);
      if (map[dstr]) out.push(map[dstr]);
      else out.push({ date: dstr, present: 0, absent: 0, total: 0 });
      cur.setUTCDate(cur.getUTCDate() + 1);
    }

    res.json(out);
  } catch (err) {
    console.error('GET /api/attendance/monthly-report error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
