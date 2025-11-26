// backend/test/unit/enrollmentService.unit.test.js
const { expect } = require("chai");
const e = require("../../services/enrollmentService");

describe("enrollmentService", () => {
  describe("validateEnrollment & buildEnrollmentRecord", () => {
    it("rejects missing payload ids", () => {
      expect(e.validateEnrollment(null).ok).to.be.false;
      expect(e.validateEnrollment({}).ok).to.be.false;
      expect(e.validateEnrollment({ studentId: "s" }).ok).to.be.false;
      expect(e.validateEnrollment({ studentId: "s", courseId: "c" }).ok).to.be.true;
    });

    it("throws when building record without ids and builds with ids", () => {
      expect(() => e.buildEnrollmentRecord({})).to.throw();
      const rec = e.buildEnrollmentRecord({ studentId: "S1", courseId: "C1" });
      expect(rec.studentId).to.equal("S1");
      expect(rec.courseId).to.equal("C1");
      expect(rec.enrolledAt).to.be.a("number");
    });
  });

  describe("enrollmentKey, isSameEnrollment and canEnroll", () => {
    it("creates deterministic key and compares enrollments", () => {
      expect(e.enrollmentKey("S1", "C1")).to.equal("S1::C1");
      expect(e.isSameEnrollment({ studentId: "S1", courseId: "C1" }, { studentId: "S1", courseId: "C1" })).to.be.true;
      expect(e.canEnroll([{ studentId: "S1", courseId: "C1" }], "S1", "C1")).to.be.false;
      expect(e.canEnroll([{ studentId: "S1", courseId: "C1" }], "S2", "C1")).to.be.true;
    });
  });

  describe("buildEnrollmentRecords & removeEnrollmentById", () => {
    it("filters out malformed items and returns valid records", () => {
      const list = [{ studentId: "S1", courseId: "C1" }, { bad: true }, null];
      const out = e.buildEnrollmentRecords(list);
      expect(Array.isArray(out)).to.be.true;
      expect(out.length).to.equal(1);
      expect(out[0].studentId).to.equal("S1");
    });

    it("removes enrollment by id and leaves others", () => {
      const arr = [{ id: "a" }, { id: "b" }, {}];
      const res = e.removeEnrollmentById(arr, "a");
      expect(res.find((x) => x.id === "a")).to.be.undefined;
      expect(res.length).to.equal(2);
    });
  });
});
