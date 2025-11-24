// services/courseService.js

function rowToCourse(r = {}) {
  return {
    id: r.id,
    code: r.code || "",
    name: r.name || "",
    instructor: r.instructor || "",
    credits: r.credits || 0,
  };
}

function normalizeCourseCode(code = "") {
  return code.toUpperCase().replace(/\s+/g, "");
}

// Cut long course name
function abbreviateCourseName(name = "", len = 20) {
  return name.length <= len ? name : name.slice(0, len - 3) + "...";
}

// Split "CS101" → {subject: "CS", number: "101"}
function parseCourseCode(code = "") {
  const m = code.toUpperCase().match(/^([A-Z]+)(\d+)$/);
  return m ? { subject: m[1], number: m[2] } : { subject: code, number: "" };
}

function syllabusSnippet(text = "", words = 20) {
  const parts = text.trim().split(/\s+/);
  return parts.length <= words ? text : parts.slice(0, words).join(" ") + "...";
}

function validateInstructorName(name = "") {
  return /^[A-Za-z .'-]{2,100}$/.test(name.trim());
}

function isValidCredits(c) {
  return Number(c) >= 0 && Number(c) <= 10;
}

function validateCoursePayload(p = {}) {
  if (!p.code || !p.name) return { ok: false };
  if (p.credits && !isValidCredits(p.credits)) return { ok: false };
  return { ok: true };
}

function matchesQuery(q = "", course = {}) {
  q = q.toLowerCase();
  return (
    course.code?.toLowerCase().includes(q) ||
    course.name?.toLowerCase().includes(q) ||
    course.instructor?.toLowerCase().includes(q)
  );
}

module.exports = {
  rowToCourse,
  normalizeCourseCode,
  abbreviateCourseName,
  parseCourseCode,
  syllabusSnippet,
  validateInstructorName,
  isValidCredits,
  validateCoursePayload,
  matchesQuery,
};
