// backend/routes/students.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const studentService = require('../services/studentService');

function normalizeStudentPayload(payload) {
  // ensure strings, provide defaults, keep minimal fields required by schema
  return {
    admissionNo: payload.admissionNo ? String(payload.admissionNo) : null,
    firstName: payload.firstName ? String(payload.firstName) : null,
    lastName: payload.lastName ? String(payload.lastName) : '',
    email: payload.email ? String(payload.email) : ''
  };
}

function validateStudentPayloadLocal(payload) {
  const errors = [];
  if (!payload) errors.push('payload required');
  else {
    if (!payload.admissionNo) errors.push('admissionNo required');
    if (!payload.firstName) errors.push('firstName required');
    // email optional
  }
  return { valid: errors.length === 0, errors };
}

async function safeInsertStudent(database, record) {
  // use a prepared INSERT that maps to the simple students table schema
  const res = await database.run(
    `INSERT INTO students (admissionNo, firstName, lastName, email)
     VALUES (?, ?, ?, ?)`,
    [record.admissionNo, record.firstName, record.lastName, record.email]
  );
  return res;
}

async function fetchCreatedStudent(database, maybeId, admissionNo) {
  if (maybeId !== undefined && maybeId !== null) {
    try {
      const byId = await database.get('SELECT * FROM students WHERE id = ?', [maybeId]);
      if (byId) return byId;
    } catch (e) {
      // fall through to fallback
    }
  }

  // fallback: fetch latest row by admissionNo (likely unique in tests)
  if (admissionNo) {
    const row = await database.get('SELECT * FROM students WHERE admissionNo = ? ORDER BY id DESC LIMIT 1', [admissionNo]);
    return row;
  }

  // As last resort, fetch newest student
  const rows = await database.all('SELECT * FROM students ORDER BY id DESC LIMIT 1');
  return rows && rows[0];
}

/* -----------------------------
   GET /api/students
   Returns array of students
   ----------------------------- */
router.get('/', async (req, res) => {
  try {
    const database = db.getDb();
    const rows = await database.all('SELECT * FROM students');
    const mapped = (rows || []).map(r => {
      if (typeof studentService.rowToStudent === 'function') {
        return studentService.rowToStudent(r);
      }
      return r;
    });
    return res.json(mapped);
  } catch (err) {
    console.error('GET /students error:', err);
    return res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   POST /api/students
   Minimal insertion with robust fetch
   ----------------------------- */
router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};

    // prefer service validation if present
    if (typeof studentService.validateStudentPayload === 'function') {
      const v = studentService.validateStudentPayload(payload);
      if (!v || !v.valid) {
        return res.status(400).json({ errors: v && v.errors ? v.errors : ['validation failed'] });
      }
    } else {
      const localValid = validateStudentPayloadLocal(payload);
      if (!localValid.valid) return res.status(400).json({ errors: localValid.errors });
    }

    const normalized = normalizeStudentPayload(payload);
    const database = db.getDb();

    const insertResult = await safeInsertStudent(database, normalized);

    // extract maybeId safely
    let maybeId = null;
    if (insertResult && typeof insertResult === 'object') {
      if (insertResult.lastID !== undefined) maybeId = insertResult.lastID;
      else if (Array.isArray(insertResult) && insertResult[0] && insertResult[0].lastID !== undefined) maybeId = insertResult[0].lastID;
    }

    const created = await fetchCreatedStudent(database, maybeId, normalized.admissionNo);

    if (!created) return res.status(500).json({ error: 'Inserted but unable to fetch created student' });

    const mapped = (typeof studentService.rowToStudent === 'function') ? studentService.rowToStudent(created) : created;
    return res.status(201).json(mapped);
  } catch (err) {
    console.error('POST /students error:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
