// @ts-nocheck
// routes/students.js (updated to use services/studentService)
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const dbModule = require('../db');
const studentService = require('../services/studentService');
const router = express.Router();

function safeParseInt(v, def = 1) {
  const n = parseInt(v || String(def), 10);
  return Number.isFinite(n) ? n : def;
}

/**
 * GET /api/students
 */
router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase();
    const page = Math.max(1, safeParseInt(req.query.page, 1));
    const limit = Math.max(1, Math.min(100, safeParseInt(req.query.limit, 20)));
    const offset = (page - 1) * limit;

    const db = dbModule.getDb();
    if (!q) {
      const rows = await db.all('SELECT * FROM students ORDER BY updatedAt DESC LIMIT ? OFFSET ?', [limit, offset]);
      return res.json({ page, limit, results: rows.map(studentService.rowToStudent) });
    } else {
      const wildcard = `%${q}%`;
      const rows = await db.all(
        `SELECT * FROM students WHERE lower(firstName) LIKE ? OR lower(lastName) LIKE ? OR lower(admissionNo) LIKE ? ORDER BY updatedAt DESC LIMIT ? OFFSET ?`,
        [wildcard, wildcard, wildcard, limit, offset]
      );
      return res.json({ page, limit, q, results: rows.map(studentService.rowToStudent) });
    }
  } catch (err) {
    console.error('GET /api/students error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/students/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const db = dbModule.getDb();
    const r = await db.get('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (!r) return res.status(404).json({ error: 'Not found' });
    res.json(studentService.rowToStudent(r));
  } catch (err) {
    console.error('GET /api/students/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/students
 */
router.post('/', async (req, res) => {
  try {
    const raw = req.body || {};
    const validation = studentService.validateStudentPayload(raw);
    if (!validation.valid) return res.status(400).json({ error: 'Validation failed', details: validation.errors });

    const db = dbModule.getDb();
    const id = uuidv4();
    const now = Date.now();
    const s = { id, ...studentService.buildStudentRecord(raw, now) };

    await db.run(
      `INSERT INTO students (id, admissionNo, firstName, lastName, dob, email, phone, address, year, notes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.id, s.admissionNo, s.firstName, s.lastName, s.dob, s.email, s.phone, s.address, s.year, s.notes, s.createdAt, s.updatedAt]
    );

    res.status(201).json(studentService.rowToStudent(s));
  } catch (err) {
    console.error('POST /api/students error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/students/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const db = dbModule.getDb();
    const now = Date.now();
    const existing = await db.get('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const raw = req.body || {};
    const payload = {
      admissionNo: (raw.admissionNo || existing.admissionNo || '').toString().trim(),
      firstName: (raw.firstName || existing.firstName || '').toString().trim(),
      lastName: (raw.lastName || existing.lastName || '').toString().trim(),
      dob: (raw.dob || existing.dob || '').toString().trim(),
      email: (raw.email || existing.email || '').toString().trim(),
      phone: (raw.phone || existing.phone || '').toString().trim(),
      address: (raw.address || existing.address || '').toString().trim(),
      year: (raw.year || existing.year || '').toString().trim(),
      notes: (raw.notes || existing.notes || '').toString().trim()
    };

    const validation = studentService.validateStudentPayload(payload);
    if (!validation.valid) return res.status(400).json({ error: 'Validation failed', details: validation.errors });

    const updated = { ...existing, ...payload, updatedAt: now };

    await db.run(
      `UPDATE students SET admissionNo=?, firstName=?, lastName=?, dob=?, email=?, phone=?, address=?, year=?, notes=?, updatedAt=? WHERE id=?`,
      [updated.admissionNo, updated.firstName, updated.lastName, updated.dob, updated.email, updated.phone, updated.address, updated.year, updated.notes, updated.updatedAt, updated.id]
    );

    res.json(studentService.rowToStudent(updated));
  } catch (err) {
    console.error('PUT /api/students/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/students/:id
 */
router.patch('/:id', async (req, res) => {
  try {
    const db = dbModule.getDb();
    const now = Date.now();
    const existing = await db.get('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const raw = req.body || {};
    const updated = { ...existing };
    for (const k of ['admissionNo','firstName','lastName','dob','email','phone','address','year','notes']) {
      if (Object.prototype.hasOwnProperty.call(raw, k)) {
        updated[k] = (raw[k] === null || raw[k] === undefined) ? '' : raw[k].toString().trim();
      }
    }
    updated.updatedAt = now;

    const payloadForValidation = {
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email
    };
    const validation = studentService.validateStudentPayload(payloadForValidation);
    if (!validation.valid) {
      const userSetFirstOrLast = raw.firstName !== undefined || raw.lastName !== undefined;
      if (userSetFirstOrLast) return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }

    await db.run(
      `UPDATE students SET admissionNo=?, firstName=?, lastName=?, dob=?, email=?, phone=?, address=?, year=?, notes=?, updatedAt=? WHERE id=?`,
      [updated.admissionNo, updated.firstName, updated.lastName, updated.dob, updated.email, updated.phone, updated.address, updated.year, updated.notes, updated.updatedAt, updated.id]
    );

    res.json(studentService.rowToStudent(updated));
  } catch (err) {
    console.error('PATCH /api/students/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/students/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const db = dbModule.getDb();
    const info = await db.run('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ success: info.changes > 0 });
  } catch (err) {
    console.error('DELETE /api/students/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/students/bulk-delete
 */
router.post('/bulk-delete', async (req, res) => {
  try {
    const raw = req.body || {};
    const ids = Array.isArray(raw.ids) ? raw.ids : [];
    if (!ids.length) return res.status(400).json({ error: 'ids array required' });

    const db = dbModule.getDb();
    let deleted = 0;

    // Use transaction helper
    await db.transaction(async (tx) => {
      for (const id of ids) {
        const info = await tx.run('DELETE FROM students WHERE id = ?', [id]);
        if (info.changes > 0) deleted++;
      }
    })();

    res.json({ deleted });
  } catch (err) {
    console.error('POST /api/students/bulk-delete error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/students/export
 */
router.get('/export', async (req, res) => {
  try {
    const db = dbModule.getDb();
    const rows = await db.all('SELECT * FROM students ORDER BY updatedAt DESC', []);
    const header = ['id','admissionNo','firstName','lastName','dob','email','phone','address','year','notes','createdAt','updatedAt'];
    const csvLines = [header.join(',')];
    for (const r of rows) {
      const line = header.map(k => {
        let v = r[k];
        if (v === null || v === undefined) return '';
        v = String(v);
        if (v.includes('"')) v = v.replace(/"/g, '""');
        if (v.includes(',') || v.includes('"') || v.includes('\n')) return `"${v}"`;
        return v;
      }).join(',');
      csvLines.push(line);
    }
    const csv = csvLines.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
    res.send(csv);
  } catch (err) {
    console.error('GET /api/students/export error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
