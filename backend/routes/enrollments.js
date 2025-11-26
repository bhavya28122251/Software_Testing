// routes/enrollments.js
const express = require('express');
const router = express.Router();
const db = require('../db');

function isIntegerLike(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === 'number' && Number.isInteger(v)) return true;
  if (typeof v === 'string') return /^\d+$/.test(v);
  return false;
}

function validateEnrollmentPayload(payload) {
  const errors = [];
  if (!payload) {
    errors.push('payload required');
  } else {
    if (!isIntegerLike(payload.studentId)) errors.push('studentId required and must be integer-like');
    if (!isIntegerLike(payload.courseId)) errors.push('courseId required and must be integer-like');
    // semester optional but if present must be string
    if (payload.semester !== undefined && typeof payload.semester !== 'string') errors.push('semester must be a string');
  }
  return { ok: errors.length === 0, errors };
}

async function fetchCreatedEnrollment(database, maybeId, studentId, courseId, semester) {
  if (maybeId !== undefined && maybeId !== null) {
    try {
      const byId = await database.get('SELECT * FROM enrollments WHERE id = ?', [maybeId]);
      if (byId) return byId;
    } catch (e) { /* fallback */ }
  }
  const params = [studentId, courseId];
  let where = 'studentId = ? AND courseId = ?';
  if (semester !== undefined && semester !== null) {
    where += ' AND semester = ?';
    params.push(semester);
  }
  const row = await database.get(`SELECT * FROM enrollments WHERE ${where} ORDER BY id DESC LIMIT 1`, params);
  return row;
}

router.get('/', async (req, res) => {
  try {
    const database = db.getDb();
    const rows = await database.all('SELECT id, studentId, courseId, semester FROM enrollments');
    return res.json(rows || []);
  } catch (err) {
    console.error('GET /api/enroll error', err);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    const v = validateEnrollmentPayload(payload);
    if (!v.ok) return res.status(400).json({ errors: v.errors });

    const studentId = isIntegerLike(payload.studentId) ? Number(payload.studentId) : payload.studentId;
    const courseId  = isIntegerLike(payload.courseId) ? Number(payload.courseId) : payload.courseId;
    const semester  = payload.semester !== undefined && payload.semester !== null ? String(payload.semester) : null;

    const database = db.getDb();
    const result = await database.run('INSERT INTO enrollments (studentId, courseId, semester) VALUES (?, ?, ?)', [studentId, courseId, semester]);

    let maybeId = null;
    if (result && typeof result === 'object') {
      if (result.lastID !== undefined) maybeId = result.lastID;
      else if (Array.isArray(result) && result[0] && result[0].lastID !== undefined) maybeId = result[0].lastID;
    }

    const created = await fetchCreatedEnrollment(database, maybeId, studentId, courseId, semester);
    if (!created) return res.status(500).json({ error: 'Inserted but unable to fetch created enrollment' });

    return res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/enroll error:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;