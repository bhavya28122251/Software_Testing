// test/helpers/dbHelper.js
// Reset test DB schema and provide the knex instance to tests.

const knex = require('../../db'); // <-- corrected (was '././db')

async function reset() {
  // drop in safe order (remove singular and plural attendance if present)
  await knex.schema.dropTableIfExists('attendance');
  await knex.schema.dropTableIfExists('attendances');
  await knex.schema.dropTableIfExists('enrollments');
  await knex.schema.dropTableIfExists('courses');
  await knex.schema.dropTableIfExists('students');

  // create fresh schema
  await knex.schema.createTable('students', (t) => {
    t.increments('id').primary();
    t.string('admissionNo');
    t.string('firstName');
    t.string('lastName');
    t.string('email');
  });

  await knex.schema.createTable('courses', (t) => {
    t.increments('id').primary();
    t.string('code');
    t.string('title');
    t.integer('credits');
  });

  await knex.schema.createTable('enrollments', (t) => {
    t.increments('id').primary();
    t.integer('studentId').unsigned().references('id').inTable('students').onDelete('CASCADE');
    t.integer('courseId').unsigned().references('id').inTable('courses').onDelete('CASCADE');
    t.string('semester');
  });

  // attendances (plural) — keep present boolean for compatibility
  await knex.schema.createTable('attendances', (t) => {
    t.increments('id').primary();
    t.integer('studentId').unsigned().references('id').inTable('students').onDelete('CASCADE');
    t.integer('courseId').unsigned().references('id').inTable('courses').onDelete('CASCADE');
    t.date('date');
    t.boolean('present');
    t.string('status'); // add status (string) to be compatible with route SQL that selects 'status'
  });

  // attendance (singular) — some route SQL uses this name
  await knex.schema.createTable('attendance', (t) => {
    t.increments('id').primary();
    t.integer('studentId').unsigned();
    t.integer('courseId').unsigned();
    t.date('date');
    t.boolean('present');
    t.string('status');
  });

  // seed small dataset
  await knex('students').insert([
    { id: 1, admissionNo: 'ADM001', firstName: 'Sameer', lastName: 'K', email: 's@example.com' },
    { id: 2, admissionNo: 'ADM002', firstName: 'Aisha', lastName: 'R', email: 'a@example.com' }
  ]);

  await knex('courses').insert([
    { id: 1, code: 'CS101', title: 'Intro', credits: 3 },
    { id: 2, code: 'MA101', title: 'Calc', credits: 4 }
  ]);

  await knex('enrollments').insert([
    { id: 1, studentId: 1, courseId: 1, semester: '2025-01' }
  ]);

  // seed into both attendance tables
  const attendanceSeed = {
    id: 1,
    studentId: 1,
    courseId: 1,
    date: '2025-01-15',
    present: 1,
    status: 'present' // provide a status value to match route expectations
  };
  await knex('attendances').insert(attendanceSeed);
  await knex('attendance').insert(attendanceSeed);
}

module.exports = { reset, knex };
