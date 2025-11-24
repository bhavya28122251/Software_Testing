// services/enrollmentService.js

function validateEnrollment(payload = {}) {
  if (!payload.studentId || !payload.courseId)
    return { ok: false };
  return { ok: true };
}

function buildEnrollmentRecord(p = {}) {
  if (!p.studentId || !p.courseId) throw new Error("Missing IDs");
  return {
    studentId: p.studentId,
    courseId: p.courseId,
    enrolledAt: p.enrolledAt || Date.now(),
  };
}

// "S1::C1"
function enrollmentKey(studentId, courseId) {
  return `${studentId}::${courseId}`;
}

function isSameEnrollment(a, b) {
  return enrollmentKey(a.studentId, a.courseId) === enrollmentKey(b.studentId, b.courseId);
}

function canEnroll(list = [], studentId, courseId) {
  return !list.some((e) => e.studentId === studentId && e.courseId === courseId);
}

function buildEnrollmentRecords(list = []) {
  return list
    .map((p) => {
      try {
        return buildEnrollmentRecord(p);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function removeEnrollmentById(arr = [], id) {
  return arr.filter((e) => e.id !== id);
}

module.exports = {
  validateEnrollment,
  buildEnrollmentRecord,
  enrollmentKey,
  isSameEnrollment,
  canEnroll,
  buildEnrollmentRecords,
  removeEnrollmentById,
};
