// services/studentService.js

function formatFullName(firstName, lastName) {
  const f = firstName ? String(firstName).trim() : "";
  const l = lastName ? String(lastName).trim() : "";
  return `${f} ${l}`.trim();
}

// Capitalize each word (e.g., "raVi kumar" → "Ravi Kumar")
function normalizeName(name = "") {
  return String(name || "")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

// Deterministic admission no (useful for testing)
function generateAdmissionNo(index = 0, base = 100) {
  return `ADM${base + Number(index)}`;
}

// Basic email normalization
function normalizeEmail(email = "") {
  return String(email || "").trim().toLowerCase();
}

// Mask email → ravi@example.com → r***i@example.com
function maskEmail(email = "") {
  const e = normalizeEmail(email);
  if (!e.includes("@")) return e;
  const [local, domain] = e.split("@");
  if (local.length <= 2) return `*@${domain}`;
  return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}

function validatePhone(phone = "") {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^\+?\d{6,15}$/.test(cleaned);
}

// Calculate age from dob
function calculateAge(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d)) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  if (today < new Date(today.getFullYear(), d.getMonth(), d.getDate())) {
    age--;
  }
  return age;
}

function isAdult(dob, limit = 18) {
  const age = calculateAge(dob);
  return age !== null && age >= limit;
}

// Validation of student input
function validateStudentPayload(payload = {}) {
  const errors = [];
  if (!payload.firstName) errors.push("firstName required");
  if (!payload.lastName) errors.push("lastName required");
  if (payload.email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(payload.email)) errors.push("invalid email");
  }
  if (payload.phone && !validatePhone(payload.phone)) errors.push("invalid phone");

  return { valid: errors.length === 0, errors };
}

// Build student DB object
function buildStudentRecord(payload = {}, now = Date.now()) {
  return {
    admissionNo: payload.admissionNo || "",
    firstName: payload.firstName || "",
    lastName: payload.lastName || "",
    dob: payload.dob || "",
    email: normalizeEmail(payload.email || ""),
    phone: payload.phone || "",
    address: payload.address || "",
    year: payload.year || "",
    notes: payload.notes || "",
    createdAt: now,
    updatedAt: now,
  };
}

function rowToStudent(r = {}) {
  if (!r) return null;
  return {
    id: r.id,
    admissionNo: r.admissionNo,
    firstName: r.firstName,
    lastName: r.lastName,
    fullName: formatFullName(r.firstName, r.lastName),
    email: r.email,
    emailMasked: maskEmail(r.email),
    year: r.year,
    phone: r.phone,
  };
}

// Sorting students
function compareStudents(a = {}, b = {}) {
  const la = (a.lastName || "").toLowerCase();
  const lb = (b.lastName || "").toLowerCase();
  if (la < lb) return -1;
  if (la > lb) return 1;
  return (a.firstName || "").localeCompare(b.firstName || "");
}

module.exports = {
  formatFullName,
  normalizeName,
  generateAdmissionNo,
  normalizeEmail,
  maskEmail,
  validatePhone,
  calculateAge,
  isAdult,
  validateStudentPayload,
  buildStudentRecord,
  rowToStudent,
  compareStudents,
};
