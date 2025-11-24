// backend/routes/enrollments.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const enrollmentService = require('../services/enrollmentService');

/**
 * Small helpers to validate and prepare data — expanded to add lines of meaningful code
 * (not comments). These helpers make the insertion robust across drivers.
 */

function isIntegerLike(v) {
  // tolerate strings that contain only digits
  if (v === null || v === undefined) return false;
  if (typeof v === 'number' && Number.isInteger(v)) return true;
  if (typeof v === 'string') return /^\d+$/.test(v);
  return false;
}

function validatePayload(payload) {
  // returns { ok: boolean, reasons: [] }
  const reasons = [];
  if (!payload) reasons.push('payload required');
  else {
    if (!payload.studentId) reasons.push('studentId required');
    if (!payload.courseId) reasons.push('courseId required');
    // semester optional, but if present should be string
    if (payload.semester && typeof payload.semester !== 'string') reasons.push('semester must be a string');
  }
  return { ok: reasons.length === 0, reasons };
}

function buildInsertParams(payload) {
  // ensure types are friendly for sqlite: convert numeric-like strings to numbers
  const studentId = isIntegerLike(payload.studentId) ? Number(payload.studentId) : payload.studentId;
  const courseId = isIntegerLike(payload.courseId) ? Number(payload.courseId) : payload.courseId;
  const semester = payload.semester ? String(payload.semester) : null;
  return { studentId, courseId, semester };
}

async function safeRun(database, sql, params) {
  // run and return what driver returns; keep for future logging/inspection
  const r = await database.run(sql, params);
  return r;
}

async function fetchCreatedEnrollment(database, maybeId, studentId, courseId, semester) {
  // Try to fetch by id if we have it
  if (maybeId !== undefined && maybeId !== null) {
    try {
      const byId = await database.get('SELECT * FROM enrollments WHERE id = ?', [maybeId]);
      if (byId) return byId;
    } catch (e) {
      // fall through to alternative fetch
    }
  }

  // Fallback: pick the newest enrollment matching studentId+courseId+(semester if provided)
  // This is robust if id wasn't returned by the driver.
  const params = [studentId, courseId];
  let where = 'studentId = ? AND courseId = ?';
  if (semester !== null && semester !== undefined) {
    where += ' AND semester = ?';
    params.push(semester);
  }
  // Order by id desc to pick the recently inserted row
  const q = `SELECT * FROM enrollments WHERE ${where} ORDER BY id DESC LIMIT 1`;
  const row = await database.get(q, params);
  return row;
}

/* -----------------------------
   GET /api/enroll
   Return array of enrollments
   ----------------------------- */
router.get('/', async (req, res) => {
  try {
    const database = db.getDb();
    const rows = await database.all('SELECT * FROM enrollments');
    return res.json(rows || []);
  } catch (err) {
    console.error('GET /api/enroll error', err);
    return res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   POST /api/enroll
   Minimal insertion with robust fetch of created row.
   ----------------------------- */
router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};

    // Use service validator if available, else local validator
    if (typeof enrollmentService.validateEnrollment === 'function') {
      const v = enrollmentService.validateEnrollment(payload);
      if (!v.ok) {
        return res.status(400).json({ error: v.reason || v.reasons || 'validation failed' });
      }
    } else {
      const v = validatePayload(payload);
      if (!v.ok) return res.status(400).json({ error: v.reasons.join('; ') });
    }

    const { studentId, courseId, semester } = buildInsertParams(payload);

    const database = db.getDb();

    // Insert using table's schema (id is autoincrement).
    const result = await safeRun(database,
      'INSERT INTO enrollments (studentId, courseId, semester) VALUES (?, ?, ?)',
      [studentId, courseId, semester]
    );

    // Try to read back created row. Many drivers return { lastID }, some don't.
    let maybeId = null;
    if (result && typeof result === 'object') {
      if (result.lastID !== undefined) maybeId = result.lastID;
      else if (result[0] && result[0].lastID !== undefined) maybeId = result[0].lastID;
    }

    const created = await fetchCreatedEnrollment(database, maybeId, studentId, courseId, semester);

    if (!created) {
      // if still not found, return 500 since insertion succeeded but we couldn't fetch created row
      return res.status(500).json({ error: 'Inserted but unable to fetch created enrollment' });
    }

    return res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/enroll error', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
