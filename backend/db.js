// backend/db.js
// Exports a knex instance with small sqlite3-like helpers (.all, .get, .run)
// and getDb() and init() helpers to keep existing code working.

const knexLib = require('knex');

const knex = knexLib({
  client: 'sqlite3',
  connection: {
    filename: process.env.TEST_SQLITE_FILE || './dev.sqlite3'
  },
  useNullAsDefault: true,
  // For in-memory SQLite tests, ensure only one connection is used.
  // This avoids "Unable to acquire a connection" and keeps :memory: stable.
  pool: { min: 1, max: 1 }
});

// allow code to call db.getDb() like your routes do
knex.getDb = () => knex;

// initialize schema if needed (safe to call multiple times)
knex.init = async function initDB() {
  // Students
  if (!(await knex.schema.hasTable('students'))) {
    await knex.schema.createTable('students', (t) => {
      t.increments('id').primary();
      t.string('admissionNo');
      t.string('firstName');
      t.string('lastName');
      t.string('email');
      t.string('year');
    });
  }

  // Courses
  if (!(await knex.schema.hasTable('courses'))) {
    await knex.schema.createTable('courses', (t) => {
      t.increments('id').primary();
      t.string('code');
      t.string('title');
      t.integer('credits');
    });
  }

  // Enrollments
  if (!(await knex.schema.hasTable('enrollments'))) {
    await knex.schema.createTable('enrollments', (t) => {
      t.increments('id').primary();
      t.integer('studentId').unsigned();
      t.integer('courseId').unsigned();
      t.string('semester');
    });
  }

  // Attendances (plural)
  if (!(await knex.schema.hasTable('attendances'))) {
    await knex.schema.createTable('attendances', (t) => {
      t.increments('id').primary();
      t.integer('studentId').unsigned();
      t.integer('courseId').unsigned();
      t.date('date');
      t.boolean('present');
      t.string('status');
    });
  }

  // Attendance (singular) - some legacy SQL uses this table name
  if (!(await knex.schema.hasTable('attendance'))) {
    await knex.schema.createTable('attendance', (t) => {
      t.increments('id').primary();
      t.integer('studentId').unsigned();
      t.integer('courseId').unsigned();
      t.date('date');
      t.boolean('present');
      t.string('status');
    });
  }
};

// --- Compatibility wrappers (sqlite3-like) ---
// Support both callback-style usage and promise-style.

function normalizeParams(params) {
  if (params === undefined || params === null) return [];
  return params;
}

// database.all(sql, params?, cb?)
knex.all = function (sql, params, cb) {
  if (typeof params === 'function') {
    cb = params;
    params = [];
  }
  params = normalizeParams(params);
  const promise = knex.raw(sql, params).then((rawResult) => {
    // normalize result to an array of rows
    if (Array.isArray(rawResult)) return rawResult;
    if (rawResult && rawResult.length) return rawResult;
    if (rawResult && rawResult.rows) return rawResult.rows;
    return rawResult;
  });

  if (typeof cb === 'function') {
    promise.then(rows => cb(null, rows)).catch(err => cb(err));
    return;
  }
  return promise;
};

// database.get(sql, params?, cb?) -> first row
knex.get = function (sql, params, cb) {
  if (typeof params === 'function') {
    cb = params;
    params = [];
  }
  params = normalizeParams(params);

  const promise = knex.raw(sql, params).then((rawResult) => {
    let rows = rawResult;
    if (!Array.isArray(rows) && rawResult && rawResult.rows) rows = rawResult.rows;
    if (Array.isArray(rows)) return rows[0];
    return rows;
  });

  if (typeof cb === 'function') {
    promise.then(row => cb(null, row)).catch(err => cb(err));
    return;
  }
  return promise;
};

// database.run(sql, params?, cb?) - run a statement (INSERT/UPDATE/DELETE)
knex.run = function (sql, params, cb) {
  if (typeof params === 'function') {
    cb = params;
    params = [];
  }
  params = normalizeParams(params);

  const promise = knex.raw(sql, params).then((res) => {
    // res can be a driver-specific object; return it as-is
    return res;
  });

  if (typeof cb === 'function') {
    promise.then(r => cb(null, r)).catch(err => cb(err));
    return;
  }
  return promise;
};

module.exports = knex;
