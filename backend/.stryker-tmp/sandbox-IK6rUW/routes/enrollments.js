// @ts-nocheck
// routes/enrollments.js (updated to use services/enrollmentService)
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const dbModule = require('../db');
const enrollmentService = require('../services/enrollmentService');
const router = express.Router();

function safeParseInt(v, def = 1) {
  const n = parseInt(v || String(def), 10);
  return Number.isFinite(n) ? n : def;
}

/**
 * GET /api/enroll
 */
router.get('/', async (req, res) => {
  try {
    const studentId = req.query.studentId;
    const courseId = req.query.courseId;
    const page = Math.max(1, safeParseInt(req.query.page, 1));
    const limit = Math.max(1, Math.min(100, safeParseInt(req.query.limit, 50)));
    const offset = (page - 1) * limit;
    const db = dbModule.getDb();

    let rows;
    if (studentId) {
      rows = await db.all('SELECT * FROM enrollments WHERE studentId = ? ORDER BY enrolledAt DESC LIMIT ? OFFSET ?', [studentId, limit, offset]);
    } else if (courseId) {
      rows = await db.all('SELECT * FROM enrollments WHERE courseId = ? ORDER BY enrolledAt DESC LIMIT ? OFFSET ?', [courseId, limit, offset]);
    } else {
      rows = await db.all('SELECT * FROM enrollments ORDER BY enrolledAt DESC LIMIT ? OFFSET ?', [limit, offset]);
    }
    res.json({ page, limit, results: rows.map(r => ({
      id: r.id,
      studentId: r.studentId,
      courseId: r.courseId,
      enrolledAt: r.enrolledAt
    })) });
  } catch (err) {
    console.error('GET /api/enroll error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/enroll/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const db = dbModule.getDb();
    const r = await db.get('SELECT * FROM enrollments WHERE id = ?', [req.params.id]);
    if (!r) return res.status(404).json({ error: 'Not found' });
    res.json({ id: r.id, studentId: r.studentId, courseId: r.courseId, enrolledAt: r.enrolledAt });
  } catch (err) {
    console.error('GET /api/enroll/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/enroll
 * body: { studentId, courseId }
 */
router.post('/', async (req, res) => {
  try {
    const raw = req.body || {};
    const v = enrollmentService.validateEnrollment(raw);
    if (!v.ok) return res.status(400).json({ error: v.reason });

    const studentId = (raw.studentId || '').toString().trim();
    const courseId = (raw.courseId || '').toString().trim();

    const db = dbModule.getDb();

    // existence checks
    const student = await db.get('SELECT id FROM students WHERE id = ?', [studentId]);
    const course = await db.get('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (!student || !course) return res.status(400).json({ error: 'studentId or courseId invalid' });

    const id = uuidv4();
    const now = Date.now();
    await db.run('INSERT INTO enrollments (id, studentId, courseId, enrolledAt) VALUES (?, ?, ?, ?)', [id, studentId, courseId, now]);
    res.status(201).json({ id, studentId, courseId, enrolledAt: now });
  } catch (err) {
    console.error('POST /api/enroll error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/enroll/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const db = dbModule.getDb();
    const info = await db.run('DELETE FROM enrollments WHERE id = ?', [req.params.id]);
    res.json({ success: info.changes > 0 });
  } catch (err) {
    console.error('DELETE /api/enroll/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/enroll/bulk
 */
router.post('/bulk', async (req, res) => {
  try {
    const raw = req.body || {};
    const pairs = Array.isArray(raw.pairs) ? raw.pairs : [];
    if (!pairs.length) return res.status(400).json({ error: 'pairs required' });

    const db = dbModule.getDb();
    let created = 0;

    // Use transaction helper
    await db.transaction(async (tx) => {
      for (const p of pairs) {
        const studentId = (p.studentId || '').toString().trim();
        const courseId = (p.courseId || '').toString().trim();
        if (!studentId || !courseId) continue;
        const s = await tx.get('SELECT id FROM students WHERE id = ?', [studentId]);
        const c = await tx.get('SELECT id FROM courses WHERE id = ?', [courseId]);
        if (!s || !c) continue;
        await tx.run('INSERT INTO enrollments (id, studentId, courseId, enrolledAt) VALUES (?, ?, ?, ?)', [uuidv4(), studentId, courseId, Date.now()]);
        created++;
      }
    })();

    res.json({ created });
  } catch (err) {
    console.error('POST /api/enroll/bulk error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
