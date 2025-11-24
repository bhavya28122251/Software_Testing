// routes/attendance.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const attendanceService = require('../services/attendanceService');

/* -----------------------------
   Small helpers
   ----------------------------- */
function parseIntOrDef(v, d) { const n = parseInt(v, 10); return Number.isNaN(n) ? d : n; }
function safeTrim(s) { return (s || '').toString().trim(); }
function toCsv(rows = [], header = []) {
  const lines = [];
  lines.push(header.join(','));
  for (const r of rows) {
    const line = header.map(h => {
      const v = r[h] === undefined || r[h] === null ? '' : String(r[h]).replace(/\r?\n/g, ' ');
      return `"${v.replace(/"/g, '""')}"`;
    }).join(',');
    lines.push(line);
  }
  return lines.join('\n');
}

/* -----------------------------
   GET /api/attendance
   Filters: studentId, courseId, from, to, page, perPage
   ----------------------------- */
router.get('/', async (req, res) => {
  try {
    const studentId = safeTrim(req.query.studentId);
    const courseId = safeTrim(req.query.courseId);
    const from = safeTrim(req.query.from);
    const to = safeTrim(req.query.to);
    const page = parseIntOrDef(req.query.page, 1);
    const perPage = parseIntOrDef(req.query.perPage, 50);

    const database = db.getDb();
    let rows = await database.all('SELECT * FROM attendance ORDER BY date DESC');

    if (studentId) rows = rows.filter(r => String(r.studentId) === String(studentId));
    if (courseId) rows = rows.filter(r => String(r.courseId) === String(courseId));
    if (from) rows = rows.filter(r => String(r.date) >= String(from));
    if (to) rows = rows.filter(r => String(r.date) <= String(to));

    const start = (page - 1) * perPage;
    const data = rows.slice(start, start + perPage).map(attendanceService.rowToAttendance);

    // Return plain array (tests expect an array)
    return res.json(data);
  } catch (err) {
    console.error('GET /api/attendance error', err);
    return res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   POST /api/attendance
   Body: { studentId, courseId, date, status, force }
   Uses markStatus to decide insert/update/skip
   ----------------------------- */
router.post('/', async (req, res) => {
  try {
    const { studentId, courseId, date, status } = req.body || {};
    const force = !!req.body.force;
    if (!studentId || !courseId || !date) return res.status(400).json({ error: 'studentId, courseId and date required' });

    const database = db.getDb();
    // load relevant attendance rows
    const rows = await database.all('SELECT studentId, courseId, date, status FROM attendance');
    const result = attendanceService.markStatus(rows, studentId, courseId, date, status || 'present', force);

    if (result.inserted) {
      await database.run('INSERT INTO attendance (studentId, courseId, date, status) VALUES (?, ?, ?, ?)', [studentId, courseId, date, result.row.status]);
    } else if (result.updated) {
      await database.run('UPDATE attendance SET status = ? WHERE studentId = ? AND courseId = ? AND date = ?', [result.row.status, studentId, courseId, date]);
    }

    // Return 201 Created (tests expect 201)
    return res.status(201).json({ ok: true, result });
  } catch (err) {
    console.error('POST /api/attendance error', err);
    return res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   POST /api/attendance/upload-csv
   Body: { csv: 'studentId,courseId,date,status\\n...' }
   ----------------------------- */
router.post('/upload-csv', async (req, res) => {
  try {
    const csv = req.body && req.body.csv;
    if (!csv) return res.status(400).json({ error: 'csv required in body.csv' });

    const { rows, errors } = attendanceService.parseCsv(csv);
    if (errors.length) return res.status(400).json({ errors });

    const database = db.getDb();
    const inserted = [];
    for (const r of rows) {
      const rres = await database.run('INSERT INTO attendance (studentId, courseId, date, status) VALUES (?, ?, ?, ?)', [r.studentId, r.courseId, r.date, r.status]);
      // some drivers return lastID; fallback to query
      let created;
      if (rres && rres.lastID) {
        created = await database.get('SELECT * FROM attendance WHERE id = ?', [rres.lastID]);
      } else {
        const latest = await database.all('SELECT * FROM attendance ORDER BY id DESC LIMIT 1');
        created = latest && latest[0];
      }
      inserted.push(created);
    }

    return res.json({ inserted: inserted.length, rows: inserted });
  } catch (err) {
    console.error('POST /api/attendance/upload-csv error', err);
    return res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   GET /api/attendance/summary/student/:id
   ----------------------------- */
router.get('/summary/student/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const database = db.getDb();
    const rows = await database.all('SELECT studentId, courseId, date, status FROM attendance WHERE studentId = ?', [studentId]);
    const summary = attendanceService.summarizeStudent(rows, studentId);
    return res.json(summary);
  } catch (err) {
    console.error('GET /api/attendance/summary/student error', err);
    return res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   GET /api/attendance/summary/course/:id
   ----------------------------- */
router.get('/summary/course/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const database = db.getDb();
    const rows = await database.all('SELECT studentId, courseId, date, status FROM attendance WHERE courseId = ?', [courseId]);
    const summary = attendanceService.summarizeCourse(rows, courseId);
    return res.json(summary);
  } catch (err) {
    console.error('GET /api/attendance/summary/course error', err);
    return res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   GET /api/attendance/heatmap/:courseId
   ----------------------------- */
router.get('/heatmap/:courseId', async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const database = db.getDb();
    const rows = await database.all('SELECT studentId, courseId, date, status FROM attendance WHERE courseId = ?', [courseId]);
    const map = attendanceService.attendanceHeatmap(rows, courseId);
    return res.json(map);
  } catch (err) {
    console.error('GET /api/attendance/heatmap error', err);
    return res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   GET /api/attendance/missing/:studentId
   ----------------------------- */
router.get('/missing/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const datesParam = req.query.dates || '';
    const dates = datesParam.split(',').map(s => s.trim()).filter(Boolean);
    if (!dates.length) return res.status(400).json({ error: 'dates query param required (comma-separated)' });

    const database = db.getDb();
    const rows = await database.all('SELECT studentId, courseId, date, status FROM attendance WHERE studentId = ?', [studentId]);
    const missing = attendanceService.findMissingDates(rows, studentId, dates);
    return res.json({ studentId, missing });
  } catch (err) {
    console.error('GET /api/attendance/missing error', err);
    return res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   GET /api/attendance/consecutive/:studentId
   ----------------------------- */
router.get('/consecutive/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const database = db.getDb();
    const rows = await database.all('SELECT studentId, courseId, date, status FROM attendance WHERE studentId = ?', [studentId]);
    const streak = attendanceService.consecutiveAbsences(rows, studentId);
    return res.json({ studentId, maxConsecutiveAbsences: streak });
  } catch (err) {
    console.error('GET /api/attendance/consecutive error', err);
    return res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   GET /api/attendance/export/csv
   ----------------------------- */
router.get('/export/csv', async (req, res) => {
  try {
    const studentId = req.query.studentId;
    const courseId = req.query.courseId;
    const from = req.query.from;
    const to = req.query.to;

    const database = db.getDb();
    let rows = await database.all('SELECT * FROM attendance');

    if (studentId) rows = rows.filter(r => String(r.studentId) === String(studentId));
    if (courseId) rows = rows.filter(r => String(r.courseId) === String(courseId));
    if (from) rows = rows.filter(r => String(r.date) >= String(from));
    if (to) rows = rows.filter(r => String(r.date) <= String(to));

    const csv = toCsv(rows, ['id','studentId','courseId','date','status']);
    res.setHeader('Content-Type', 'text/csv');
    return res.send(csv);
  } catch (err) {
    console.error('GET /api/attendance/export/csv error', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
