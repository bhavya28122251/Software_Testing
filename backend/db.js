// backend/db.js  (sqlite3 async wrapper)
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data', 'students.db');

let rawDb = null;

/**
 * Initialize DB (create folder if needed, open DB, create tables if missing)
 */
function init() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  rawDb = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Failed to open sqlite db:', err);
      throw err;
    }
  });

  // Create tables (exec is fine here)
  const createSql = `
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      admissionNo TEXT,
      firstName TEXT,
      lastName TEXT,
      dob TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      year TEXT,
      notes TEXT,
      createdAt INTEGER,
      updatedAt INTEGER
    );
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      code TEXT,
      name TEXT,
      instructor TEXT
    );
    CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      studentId TEXT,
      courseId TEXT,
      enrolledAt INTEGER
    );
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      studentId TEXT,
      courseId TEXT,
      date TEXT,
      status TEXT
    );
  `;
  rawDb.exec(createSql, (err) => {
    if (err) console.error('Error creating tables:', err);
  });
}

/**
 * Promise wrappers for run/get/all
 */
function _run(sql, params = []) {
  return new Promise((resolve, reject) => {
    rawDb.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function _all(sql, params = []) {
  return new Promise((resolve, reject) => {
    rawDb.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function _get(sql, params = []) {
  return new Promise((resolve, reject) => {
    rawDb.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

/**
 * transaction helper
 * Accepts an async function fn(tx) { await tx.run(...); ... }
 * and runs BEGIN/COMMIT/ROLLBACK around it.
 */
function _transaction(fn) {
  return (async (...args) => {
    await _run('BEGIN');
    try {
      const result = await fn({
        run: _run,
        all: _all,
        get: _get
      }, ...args);
      await _run('COMMIT');
      return result;
    } catch (err) {
      await _run('ROLLBACK');
      throw err;
    }
  });
}

/**
 * Compatibility: expose getDb() returning async API
 * - run(sql, params)
 * - all(sql, params)
 * - get(sql, params)
 * - transaction(fn) -> returns callable async function
 */
function getDb() {
  if (!rawDb) init();
  return {
    run: _run,
    all: _all,
    get: _get,
    transaction: (fn) => _transaction(fn)
  };
}

module.exports = { init, getDb };
