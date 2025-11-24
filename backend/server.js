// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
const students = require('./routes/students');
const courses = require('./routes/courses');
const enroll = require('./routes/enrollments');
const attendance = require('./routes/attendance');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/students', students);
app.use('/api/courses', courses);
app.use('/api/enroll', enroll);
app.use('/api/attendance', attendance);

const PORT = process.env.PORT || 4000;
db.init(); // create db & tables

if (require.main === module) {
    app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
}

module.exports = app;
