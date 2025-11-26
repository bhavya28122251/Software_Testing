// routes/attendance.js
const express = require('express');
const router = express.Router();
const db = require('../db');

function isIntegerLike(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === 'number' && Number.isInteger(v)) return true;
  if (typeof v === 'string') return /^\d+$/.test(v);
  return false;
}

function validateAttendancePayload(payload) {
  const errors = [];
  if (!payload) {
    errors.push('payload required');
  } else {
    if (!isIntegerLike(payload.studentId)) errors.push('studentId required and must be integer-like');
    if (!isIntegerLike(payload.courseId)) errors.push('courseId required and must be integer-like');
    if (!payload.date) errors.push('date required');
    if (!payload.status) errors.push('status required');
  }
  return { ok: errors.length === 0, errors };
}

async function fetchCreated(database, maybeId, whereClause, params) {
  if (maybeId !== undefined && maybeId !== null) {
    try {
      const byId = await database.get(`SELECT * FROM attendance WHERE id = ?`, [maybeId]);
      if (byId) return byId;
    } catch (e) { /* fallback below */}
  }
  // fallback: get newest matching row
  const row = await database.get(`SELECT * FROM attendance WHERE ${whereClause} ORDER BY id DESC LIMIT 1`, params);
  return row;
}

router.get('/', async (req, res) => {
  try {
    const database = db.getDb();
    const rows = await database.all('SELECT studentId, courseId, date, status, id FROM attendance ORDER BY date DESC');
    return res.json(rows || []);
  } catch (err) {
    console.error('GET /api/attendance error', err);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    const v = validateAttendancePayload(payload);
    if (!v.ok) return res.status(400).json({ errors: v.errors });

    const studentId = isIntegerLike(payload.studentId) ? Number(payload.studentId) : payload.studentId;
    const courseId  = isIntegerLike(payload.courseId) ? Number(payload.courseId) : payload.courseId;
    const date = String(payload.date);
    const status = String(payload.status);

    const database = db.getDb();
    const result = await database.run(
      'INSERT INTO attendance (studentId, courseId, date, status) VALUES (?, ?, ?, ?)',
      [studentId, courseId, date, status]
    );

    // extract maybeId defensively
    let maybeId = null;
    if (result && typeof result === 'object') {
      if (result.lastID !== undefined) maybeId = result.lastID;
      else if (Array.isArray(result) && result[0] && result[0].lastID !== undefined) maybeId = result[0].lastID;
    }

    const created = await fetchCreated(database, maybeId, 'studentId = ? AND courseId = ? AND date = ?', [studentId, courseId, date]);

    if (!created) return res.status(500).json({ error: 'Inserted but unable to fetch attendance record' });

    return res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/attendance error:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
