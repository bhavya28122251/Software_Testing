// @ts-nocheck
// routes/courses.js (updated to use services/courseService)
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const dbModule = require('../db');
const courseService = require('../services/courseService');
const router = express.Router();

function safeParseInt(v, def = 1) {
  const n = parseInt(v || String(def), 10);
  return Number.isFinite(n) ? n : def;
}

/**
 * GET /api/courses
 */
router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase();
    const page = Math.max(1, safeParseInt(req.query.page, 1));
    const limit = Math.max(1, Math.min(100, safeParseInt(req.query.limit, 20)));
    const offset = (page - 1) * limit;
    const db = dbModule.getDb();

    if (!q) {
      const rows = await db.all('SELECT * FROM courses ORDER BY name ASC LIMIT ? OFFSET ?', [limit, offset]);
      return res.json({ page, limit, results: rows.map(courseService.rowToCourse) });
    } else {
      const w = `%${q}%`;
      const rows = await db.all(
        `SELECT * FROM courses WHERE lower(code) LIKE ? OR lower(name) LIKE ? OR lower(instructor) LIKE ? ORDER BY name ASC LIMIT ? OFFSET ?`,
        [w, w, w, limit, offset]
      );
      return res.json({ page, limit, q, results: rows.map(courseService.rowToCourse) });
    }
  } catch (err) {
    console.error('GET /api/courses error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/courses/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const db = dbModule.getDb();
    const r = await db.get('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    if (!r) return res.status(404).json({ error: 'Not found' });
    res.json(courseService.rowToCourse(r));
  } catch (err) {
    console.error('GET /api/courses/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/courses
 */
router.post('/', async (req, res) => {
  try {
    const raw = req.body || {};
    const payload = {
      code: (raw.code || '').toString().trim(),
      name: (raw.name || '').toString().trim(),
      instructor: (raw.instructor || '').toString().trim()
    };

    const v = courseService.validateCoursePayload(payload);
    if (!v.ok) return res.status(400).json({ error: v.reason });

    const db = dbModule.getDb();
    const id = uuidv4();
    await db.run('INSERT INTO courses (id, code, name, instructor) VALUES (?, ?, ?, ?)', [
      id, payload.code, payload.name, payload.instructor
    ]);
    res.status(201).json({ id, ...payload });
  } catch (err) {
    console.error('POST /api/courses error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/courses/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const db = dbModule.getDb();
    const existing = await db.get('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const raw = req.body || {};
    const payload = {
      code: (raw.code || existing.code || '').toString().trim(),
      name: (raw.name || existing.name || '').toString().trim(),
      instructor: (raw.instructor || existing.instructor || '').toString().trim()
    };

    const v = courseService.validateCoursePayload(payload);
    if (!v.ok) return res.status(400).json({ error: v.reason });

    await db.run('UPDATE courses SET code=?, name=?, instructor=? WHERE id=?', [
      payload.code, payload.name, payload.instructor, req.params.id
    ]);
    res.json({ id: req.params.id, ...payload });
  } catch (err) {
    console.error('PUT /api/courses/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/courses/:id
 */
router.patch('/:id', async (req, res) => {
  try {
    const db = dbModule.getDb();
    const existing = await db.get('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const raw = req.body || {};
    const updated = { ...existing };
    for (const k of ['code','name','instructor']) {
      if (Object.prototype.hasOwnProperty.call(raw, k)) {
        updated[k] = (raw[k] === null || raw[k] === undefined) ? '' : raw[k].toString().trim();
      }
    }

    await db.run('UPDATE courses SET code=?, name=?, instructor=? WHERE id=?', [
      updated.code, updated.name, updated.instructor, req.params.id
    ]);
    res.json(courseService.rowToCourse(updated));
  } catch (err) {
    console.error('PATCH /api/courses/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/courses/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const db = dbModule.getDb();
    const info = await db.run('DELETE FROM courses WHERE id = ?', [req.params.id]);
    res.json({ success: info.changes > 0 });
  } catch (err) {
    console.error('DELETE /api/courses/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
