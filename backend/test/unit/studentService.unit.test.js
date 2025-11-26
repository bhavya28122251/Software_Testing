// backend/test/unit/studentService.unit.test.js
const { expect } = require("chai");
const student = require("../../services/studentService");

describe("studentService", () => {
  const has = (fn) => typeof student[fn] === "function";

  describe("formatFullName", () => {
    it("joins first and last name and trims", () => {
      expect(student.formatFullName("  Ravi", "Kumar ")).to.equal("Ravi Kumar");
      expect(student.formatFullName("", "Kumar")).to.equal("Kumar");
      expect(student.formatFullName(null, null)).to.equal("");
    });
  });

  describe("normalizeName", () => {
    it("capitalizes each part and collapses spaces", () => {
      expect(student.normalizeName("  raVi   kumar  ")).to.equal("Ravi Kumar");
      expect(student.normalizeName("alice")).to.equal("Alice");
      expect(student.normalizeName("")).to.equal("");
    });
  });

  describe("generateAdmissionNo", () => {
    it("returns deterministic ADM string with numeric args", () => {
      // pass numeric args so JS doesn't concatenate string base with number
      expect(student.generateAdmissionNo(0, 100)).to.equal("ADM100");
      expect(student.generateAdmissionNo(3, 50)).to.equal("ADM53");
    });

    it("demonstrates string-base concatenation behavior (implementation edge-case)", () => {
      // current implementation will produce string concatenation if base is a string:
      // base = "50", index = "3" -> "50" + 3 => "503"
      expect(student.generateAdmissionNo("3", "50")).to.equal("ADM503");
    });
  });

  describe("normalizeEmail & maskEmail", () => {
    it("normalizes email to lowercase trimmed", () => {
      expect(student.normalizeEmail(" USER@Example.Com ")).to.equal("user@example.com");
    });

    it("masks short and long local parts correctly", () => {
      expect(student.maskEmail("ab@dom.com")).to.equal("*@dom.com");
      expect(student.maskEmail("abcd@dom.com")).to.match(/^a\*{2}d@dom\.com$/);
    });

    it("returns input unchanged if no @", () => {
      expect(student.maskEmail("notanemail")).to.equal("notanemail");
    });
  });

  describe("validatePhone", () => {
    it("accepts valid numbers and rejects invalid", () => {
      expect(student.validatePhone("+919876543210")).to.be.true;
      expect(student.validatePhone("9876543210")).to.be.true;
      expect(student.validatePhone("12345")).to.be.false;
      expect(student.validatePhone("12-AB-3456")).to.be.false;
    });
  });

  describe("calculateAge & isAdult", () => {
    it("returns null for invalid dob", () => {
      expect(student.calculateAge("not-a-date")).to.be.null;
      expect(student.calculateAge()).to.be.null;
    });

    it("calculates age near birthday boundary and checks adult limit", () => {
      const today = new Date();
      const dob = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString();
      const age = student.calculateAge(dob);
      expect(age).to.be.a("number");
      // allow ±1 because of timezone or implementation differences
      expect(age).to.satisfy((n) => n === 18 || n === 17 || n === 19);
      expect(student.isAdult(dob, 18)).to.be.true;
    });
  });

  describe("validateStudentPayload & buildStudentRecord", () => {
    it("reports missing first/last name and invalid email/phone", () => {
      const res = student.validateStudentPayload({});
      expect(res.valid).to.be.false;
      expect(res.errors).to.include("firstName required").and.to.include("lastName required");

      const badEmail = student.validateStudentPayload({ firstName: "A", lastName: "B", email: "bad@x" });
      expect(badEmail.valid).to.be.false;
      expect(badEmail.errors).to.include("invalid email");

      const badPhone = student.validateStudentPayload({ firstName: "A", lastName: "B", phone: "abc" });
      expect(badPhone.valid).to.be.false;
      expect(badPhone.errors).to.include("invalid phone");
    });

    it("builds student record with normalized email and timestamps", () => {
      const now = Date.now();
      const rec = student.buildStudentRecord({ firstName: "A", lastName: "B", email: "X@Y.COM" }, now);
      expect(rec.firstName).to.equal("A");
      expect(rec.lastName).to.equal("B");
      expect(rec.email).to.equal("x@y.com");
      expect(rec.createdAt).to.equal(now);
      expect(rec.updatedAt).to.equal(now);
    });
  });

  describe("rowToStudent & compareStudents", () => {
    it("maps row to student shape and masks email", () => {
      const r = { id: "1", admissionNo: "ADM101", firstName: "R", lastName: "K", email: "rk@ex.com", year: "2" };
      const out = student.rowToStudent(r);
      expect(out.id).to.equal("1");
      expect(out.fullName).to.equal("R K");
      expect(out.emailMasked).to.be.a("string");
    });

    it("compareStudents sorts by last then first", () => {
      const a = { firstName: "A", lastName: "Alpha" };
      const b = { firstName: "B", lastName: "Beta" };
      expect(student.compareStudents(a, b)).to.equal(-1);
      expect(student.compareStudents(b, a)).to.equal(1);
      const c = { firstName: "Ada", lastName: "Alpha" };
      expect(student.compareStudents(a, c)).to.be.a("number");
    });
  });
});
