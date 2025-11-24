// services/attendanceService.js

function rowToAttendance(r = {}) {
  return {
    id: r.id,
    studentId: r.studentId,
    courseId: r.courseId,
    date: r.date,
    status: r.status,
  };
}

function isValidDateISO(date) {
  const m = /^\d{4}-\d{2}-\d{2}$/.test(date);
  if (!m) return false;
  const d = new Date(date);
  return !isNaN(d);
}

function parseCsv(text = "") {
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(",");
  const required = ["studentId", "courseId", "date", "status"];
  const errors = [];
  if (!required.every((h) => header.includes(h))) {
    errors.push("missing columns");
    return { rows: [], errors };
  }

  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const row = {};
    header.forEach((h) => (row[h] = cols[idx[h]] || ""));

    if (!row.studentId || !row.courseId || !row.status) {
      errors.push("missing required fields");
      continue;
    }

    if (!isValidDateISO(row.date)) errors.push("invalid date");
    row.status = row.status.toLowerCase();

    rows.push(row);
  }

  return { rows, errors };
}

function calculateAttendancePercentage(present, total) {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
}

// Insert/update attendance row
function markStatus(rows = [], sid, cid, date, status = "present", force = false) {
  const key = `${sid}::${cid}::${date}`;
  const index = rows.findIndex((r) => `${r.studentId}::${r.courseId}::${r.date}` === key);

  if (index === -1) {
    const row = { studentId: sid, courseId: cid, date, status };
    rows.push(row);
    return { inserted: 1, updated: 0, skipped: 0, row };
  }

  if (force) {
    rows[index].status = status;
    return { inserted: 0, updated: 1, skipped: 0, row: rows[index] };
  }

  return { inserted: 0, updated: 0, skipped: 1, row: rows[index] };
}

function summarizeStudent(rows = [], sid) {
  const r = rows.filter((x) => x.studentId === sid);
  const total = r.length;
  const present = r.filter((x) => x.status === "present").length;
  return { studentId: sid, total, present, percentage: calculateAttendancePercentage(present, total) };
}

function findMissingDates(rows = [], sid, dates = []) {
  const done = rows.filter((r) => r.studentId === sid).map((x) => x.date);
  return dates.filter((d) => !done.includes(d));
}

function consecutiveAbsences(rows = [], sid) {
  const sorted = rows.filter((r) => r.studentId === sid).sort((a, b) => a.date.localeCompare(b.date));
  let streak = 0,
    max = 0;

  for (const r of sorted) {
    if (r.status === "absent") {
      streak++;
      max = Math.max(max, streak);
    } else {
      streak = 0;
    }
  }

  return max;
}

module.exports = {
  rowToAttendance,
  isValidDateISO,
  parseCsv,
  calculateAttendancePercentage,
  markStatus,
  summarizeStudent,
  findMissingDates,
  consecutiveAbsences,
};
