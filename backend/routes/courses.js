// backend/routes/courses.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const courseService = require('../services/courseService');

/**
 * GET /api/courses
 * Tests expect: an ARRAY of { id, code, title, credits }
 */
router.get('/', async (req, res) => {
  try {
    const database = db.getDb();
    const rows = await database.all('SELECT * FROM courses');
    const mapped = rows.map(r => ({
      id: r.id,
      code: r.code,
      title: r.title,
      credits: r.credits
    }));
    res.json(mapped);
  } catch (err) {
    console.error('GET /api/courses error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/courses
 * Required: code, title
 */
router.post('/', async (req, res) => {
  try {
    const { code, title, credits } = req.body || {};
    if (!code || !title) {
      return res.status(400).json({ error: 'code and title are required' });
    }

    const database = db.getDb();
    const result = await database.run(
      'INSERT INTO courses (code, title, credits) VALUES (?, ?, ?)',
      [code, title, credits ?? null]
    );

    const id = result.lastID;
    res.status(201).json({ id });
  } catch (err) {
    console.error('POST /api/courses error', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
