// routes/courses.js
const express = require('express');
const router = express.Router();
const db = require('../db');

function validateCoursePayload(payload) {
  const errors = [];
  if (!payload) {
    errors.push('payload required');
  } else {
    if (!payload.code || String(payload.code).trim() === '') errors.push('code required');
    if (!payload.title || String(payload.title).trim() === '') errors.push('title required');
    // credits optional but if present should be numeric
    if (payload.credits !== undefined && payload.credits !== null) {
      const c = Number(payload.credits);
      if (Number.isNaN(c)) errors.push('credits must be a number');
    }
  }
  return { ok: errors.length === 0, errors };
}

async function fetchCreatedCourse(database, maybeId, code, title) {
  if (maybeId !== undefined && maybeId !== null) {
    try {
      const byId = await database.get('SELECT * FROM courses WHERE id = ?', [maybeId]);
      if (byId) return byId;
    } catch (e) { /* fallback */ }
  }
  // fallback by unique code/title
  const row = await database.get('SELECT * FROM courses WHERE code = ? OR title = ? ORDER BY id DESC LIMIT 1', [code, title]);
  return row;
}

router.get('/', async (req, res) => {
  try {
    const database = db.getDb();
    const rows = await database.all('SELECT id, code, title, credits FROM courses');
    return res.json(rows || []);
  } catch (err) {
    console.error('GET /api/courses error', err);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    const v = validateCoursePayload(payload);
    if (!v.ok) return res.status(400).json({ errors: v.errors });

    const code = String(payload.code).trim();
    const title = String(payload.title).trim();
    const credits = payload.credits !== undefined && payload.credits !== null ? Number(payload.credits) : null;

    const database = db.getDb();
    const result = await database.run('INSERT INTO courses (code, title, credits) VALUES (?, ?, ?)', [code, title, credits]);

    let maybeId = null;
    if (result && typeof result === 'object') {
      if (result.lastID !== undefined) maybeId = result.lastID;
      else if (Array.isArray(result) && result[0] && result[0].lastID !== undefined) maybeId = result[0].lastID;
    }

    const created = await fetchCreatedCourse(database, maybeId, code, title);
    if (!created) return res.status(500).json({ error: 'Inserted but unable to fetch created course' });

    return res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/courses error:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;