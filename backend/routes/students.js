/*******************************************************
 * STUDENTS ROUTE (EXTENDED VERSION)
 * -----------------------------------------------------
 * Includes:
 * - Full CRUD
 * - Pagination
 * - Sorting using service.compareStudents
 * - Search by ANY field
 * - Mini-cache system
 * - Filter by year
 * - Stats endpoint (count by year)
 * - FullName normalization preview
 * - Export as CSV
 *******************************************************/

const express = require('express');
const router = express.Router();
const db = require('../db');
const studentService = require('../services/studentService');

/***********************
 * In-Memory Cache
 ***********************/
const cache = {}; // { key : { ts, value } }
const CACHE_TTL = 60 * 1000; // 1 minute

function setCache(key, value) {
  cache[key] = { ts: Date.now(), value };
}
function getCache(key) {
  if (!cache[key]) return null;
  if (Date.now() - cache[key].ts > CACHE_TTL) return null;
  return cache[key].value;
}

/***********************
 * Helper functions
 ***********************/
function paginate(arr, page = 1, size = 20) {
  page = Number(page) || 1;
  size = Number(size) || 20;
  const start = (page - 1) * size;
  return {
    page,
    perPage: size,
    total: arr.length,
    data: arr.slice(start, start + size)
  };
}

function safeLower(s) {
  return (s || "").toString().toLowerCase();
}

/***********************
 * GET /api/students
 * LIST, SEARCH, PAGINATION
 ***********************/
router.get('/', async (req, res) => {
  try {
    const q = safeLower(req.query.q);
    const year = req.query.year || "";
    const page = req.query.page || 1;
    const size = req.query.size || 20;

    const cacheKey = `students:${q}:${year}:${page}:${size}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    const database = db.getDb();
    const rows = await database.all("SELECT * FROM students");

    // FILTER
    let filtered = rows;
    if (q) {
      filtered = filtered.filter(r => {
        const bag = `${r.firstName} ${r.lastName} ${r.email} ${r.admissionNo}`.toLowerCase();
        return bag.includes(q);
      });
    }
    if (year) {
      filtered = filtered.filter(r => `${r.year}` === `${year}`);
    }

    // Map using service
    const mapped = filtered.map(studentService.rowToStudent);

    const paged = paginate(mapped, page, size);
    setCache(cacheKey, paged);

    res.json(paged);
  } catch (err) {
    console.error("GET /students error:", err);
    res.status(500).json({ error: err.message });
  }
});

/***********************
 * GET /api/students/:id
 ***********************/
router.get('/:id', async (req, res) => {
  try {
    const database = db.getDb();
    const row = await database.get("SELECT * FROM students WHERE id = ?", [req.params.id]);
    if (!row) return res.status(404).json({ error: "Student not found" });
    res.json(studentService.rowToStudent(row));
  } catch (err) {
    console.error("GET /students/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

/***********************
 * POST /api/students
 ***********************/
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const validation = studentService.validateStudentPayload(payload);

    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const record = studentService.buildStudentRecord(payload);
    const database = db.getDb();

    const id = 'S-' + Date.now();
    const result = await database.run(
      `INSERT INTO students
      (id, admissionNo, firstName, lastName, dob, email, phone, address, year, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, record.admissionNo, record.firstName, record.lastName, record.dob,
        record.email, record.phone, record.address, record.year, record.notes,
        record.createdAt, record.updatedAt]
    );

    const created = await database.get("SELECT * FROM students WHERE id = ?", [id]);
    res.status(201).json(studentService.rowToStudent(created));

  } catch (err) {
    console.error("POST /students error:", err);
    res.status(500).json({ error: err.message });
  }
});

/***********************
 * PUT /api/students/:id
 ***********************/
router.put('/:id', async (req, res) => {
  try {
    const payload = req.body;
    const validation = studentService.validateStudentPayload(payload);

    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const record = studentService.buildStudentRecord(payload, Date.now());
    const database = db.getDb();

    await database.run(
      `UPDATE students SET
        admissionNo=?, firstName=?, lastName=?, dob=?, email=?, phone=?,
        address=?, year=?, notes=?, updatedAt=?
       WHERE id=?`,
      [
        record.admissionNo, record.firstName, record.lastName, record.dob,
        record.email, record.phone, record.address, record.year,
        record.notes, record.updatedAt, req.params.id
      ]
    );

    const updated = await database.get("SELECT * FROM students WHERE id = ?", [req.params.id]);
    res.json(studentService.rowToStudent(updated));

  } catch (err) {
    console.error("PUT /students/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

/***********************
 * DELETE /api/students/:id
 ***********************/
router.delete('/:id', async (req, res) => {
  try {
    const database = db.getDb();
    await database.run("DELETE FROM students WHERE id = ?", [req.params.id]);
    res.status(204).end();
  } catch (err) {
    console.error("DELETE /students/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

/***********************
 * GET /api/students/sorted/name
 * Uses service.compareStudents
 ***********************/
router.get('/sorted/name/all', async (req, res) => {
  try {
    const database = db.getDb();
    const rows = await database.all("SELECT * FROM students");
    const mapped = rows.map(studentService.rowToStudent);
    mapped.sort(studentService.compareStudents);
    res.json(mapped);
  } catch (err) {
    console.error("Sorted students error:", err);
    res.status(500).json({ error: err.message });
  }
});

/***********************
 * GET /api/students/stats/year
 * Return counts per year
 ***********************/
router.get('/stats/year', async (req, res) => {
  try {
    const database = db.getDb();
    const rows = await database.all("SELECT year FROM students");

    const stats = {};
    rows.forEach(r => {
      const y = r.year || "unknown";
      stats[y] = (stats[y] || 0) + 1;
    });

    res.json(stats);

  } catch (err) {
    console.error("GET stats/year error:", err);
    res.status(500).json({ error: err.message });
  }
});

/***********************
 * GET /api/students/export/csv
 ***********************/
router.get('/export/csv', async (req, res) => {
  try {
    const database = db.getDb();
    const rows = await database.all("SELECT * FROM students");

    let csv = "id, admissionNo, firstName, lastName, email, phone\n";
    rows.forEach(r => {
      csv += `${r.id},${r.admissionNo},${r.firstName},${r.lastName},${r.email},${r.phone}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.send(csv);

  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
