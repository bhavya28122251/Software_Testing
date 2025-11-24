/*******************************************************
 * ENROLLMENTS ROUTE (EXPANDED)
 *
 * Features:
 * - List / filter enrollments
 * - Create with duplicate prevention
 * - Bulk enroll (JSON array)
 * - Bulk remove & single delete
 * - Utility helpers (groupBy student/course)
 * - Stats: enrollment counts per student & per course
 * - Safe building using enrollmentService helpers
 *
 *******************************************************/

const express = require('express');
const router = express.Router();
const db = require('../db');
const enrollmentService = require('../services/enrollmentService');

/* -----------------------------
   Helpers
   ----------------------------- */
function groupBy(arr = [], keyFn) {
  const map = {};
  for (const item of arr) {
    const key = keyFn(item);
    map[key] = map[key] || [];
    map[key].push(item);
  }
  return map;
}

function safeArray(x) { return Array.isArray(x) ? x : []; }

/* -----------------------------
   Routes
   ----------------------------- */

/**
 * GET /api/enroll
 * Query params: studentId, courseId, page, perPage
 */
router.get('/', async (req, res) => {
  try {
    const studentId = req.query.studentId;
    const courseId = req.query.courseId;
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 50;
    const database = db.getDb();
    let rows;

    if (studentId) rows = await database.all('SELECT * FROM enrollments WHERE studentId = ?', [studentId]);
    else if (courseId) rows = await database.all('SELECT * FROM enrollments WHERE courseId = ?', [courseId]);
    else rows = await database.all('SELECT * FROM enrollments');

    // sort by id (descending)
    rows.sort((a, b) => (b.id || 0) - (a.id || 0));
    const total = rows.length;
    const start = (page - 1) * perPage;
    const data = rows.slice(start, start + perPage);
    res.json({ page, perPage, total, data });
  } catch (err) {
    console.error('GET /api/enroll error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/enroll
 * Body: { studentId, courseId }
 * Validates using enrollmentService and prevents duplicates
 */
router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    const v = enrollmentService.validateEnrollment(payload);
    if (!v.ok) return res.status(400).json({ error: v.reason });

    const rec = enrollmentService.buildEnrollmentRecord(payload);
    const database = db.getDb();

    // prevent duplicate
    const exists = await database.get('SELECT * FROM enrollments WHERE studentId = ? AND courseId = ?', [rec.studentId, rec.courseId]);
    if (exists) return res.status(409).json({ error: 'already enrolled' });

    const result = await database.run('INSERT INTO enrollments (studentId, courseId, enrolledAt) VALUES (?, ?, ?)', [rec.studentId, rec.courseId, rec.enrolledAt]);
    const created = await database.get('SELECT * FROM enrollments WHERE id = ?', [result.lastID]);
    res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/enroll error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/enroll/bulk
 * Body: { enrollments: [ { studentId, courseId } ] }
 * Accepts list, uses enrollmentService.buildEnrollmentRecords
 * Skips invalid entries
 */
router.post('/bulk', async (req, res) => {
  try {
    const list = safeArray(req.body && req.body.enrollments);
    if (!list.length) return res.status(400).json({ error: 'enrollments array required' });

    const database = db.getDb();
    const results = [];
    for (const p of list) {
      try {
        const rec = enrollmentService.buildEnrollmentRecord(p);
        // check duplicate
        const exists = await database.get('SELECT * FROM enrollments WHERE studentId = ? AND courseId = ?', [rec.studentId, rec.courseId]);
        if (exists) {
          results.push({ ok: false, reason: 'duplicate', payload: p });
          continue;
        }
        const r = await database.run('INSERT INTO enrollments (studentId, courseId, enrolledAt) VALUES (?, ?, ?)', [rec.studentId, rec.courseId, rec.enrolledAt]);
        const created = await database.get('SELECT * FROM enrollments WHERE id = ?', [r.lastID]);
        results.push({ ok: true, record: created });
      } catch (e) {
        results.push({ ok: false, reason: e.message, payload: p });
      }
    }
    res.json({ count: results.length, results });
  } catch (err) {
    console.error('POST /api/enroll/bulk error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/enroll/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const database = db.getDb();
    await database.run('DELETE FROM enrollments WHERE id = ?', [id]);
    res.status(204).end();
  } catch (err) {
    console.error('DELETE /api/enroll/:id error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/enroll/remove-by-student-course
 * Body: { studentId, courseId } removes matching enrollments
 */
router.post('/remove-by-student-course', async (req, res) => {
  try {
    const studentId = req.body && req.body.studentId;
    const courseId = req.body && req.body.courseId;
    if (!studentId || !courseId) return res.status(400).json({ error: 'studentId and courseId required' });

    const database = db.getDb();
    const result = await database.run('DELETE FROM enrollments WHERE studentId = ? AND courseId = ?', [studentId, courseId]);
    res.json({ deleted: result.changes || 0 });
  } catch (err) {
    console.error('POST /api/enroll/remove-by-student-course error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/enroll/stats
 * Returns:
 *  - countPerStudent: { studentId: count }
 *  - countPerCourse:  { courseId: count }
 */
router.get('/stats', async (req, res) => {
  try {
    const database = db.getDb();
    const rows = await database.all('SELECT studentId, courseId FROM enrollments');

    const perStudent = {};
    const perCourse = {};
    for (const r of rows) {
      perStudent[r.studentId] = (perStudent[r.studentId] || 0) + 1;
      perCourse[r.courseId] = (perCourse[r.courseId] || 0) + 1;
    }

    res.json({ perStudent, perCourse, total: rows.length });
  } catch (err) {
    console.error('GET /api/enroll/stats error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/enroll/grouped/by-student
 * returns { studentId: [enrollments] }
 */
router.get('/grouped/by-student', async (req, res) => {
  try {
    const database = db.getDb();
    const rows = await database.all('SELECT * FROM enrollments');
    const grouped = groupBy(rows, r => r.studentId);
    res.json(grouped);
  } catch (err) {
    console.error('GET /api/enroll/grouped/by-student error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/enroll/grouped/by-course
 */
router.get('/grouped/by-course', async (req, res) => {
  try {
    const database = db.getDb();
    const rows = await database.all('SELECT * FROM enrollments');
    const grouped = groupBy(rows, r => r.courseId);
    res.json(grouped);
  } catch (err) {
    console.error('GET /api/enroll/grouped/by-course error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/enroll/ensure
 * Body: { studentId, courseId }
 * Ensures enrollment exists: create if missing
 */
router.post('/ensure', async (req, res) => {
  try {
    const payload = req.body || {};
    const v = enrollmentService.validateEnrollment(payload);
    if (!v.ok) return res.status(400).json({ error: v.reason });

    const database = db.getDb();
    const exists = await database.get('SELECT * FROM enrollments WHERE studentId = ? AND courseId = ?', [payload.studentId, payload.courseId]);
    if (exists) return res.json({ ok: true, existing: true, record: exists });

    const rec = enrollmentService.buildEnrollmentRecord(payload);
    const r = await database.run('INSERT INTO enrollments (studentId, courseId, enrolledAt) VALUES (?, ?, ?)', [rec.studentId, rec.courseId, rec.enrolledAt]);
    const created = await database.get('SELECT * FROM enrollments WHERE id = ?', [r.lastID]);
    res.json({ ok: true, existing: false, record: created });
  } catch (err) {
    console.error('POST /api/enroll/ensure error', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
