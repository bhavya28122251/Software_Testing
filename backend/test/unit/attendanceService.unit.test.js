// backend/test/unit/attendanceService.unit.test.js
const { expect } = require("chai");
const a = require("../../services/attendanceService");

describe("attendanceService", () => {
  describe("rowToAttendance & isValidDateISO", () => {
    it("maps row to attendance object", () => {
      const r = { id: "1", studentId: "s1", courseId: "c1", date: "2023-01-01", status: "present" };
      const out = a.rowToAttendance(r);
      expect(out.id).to.equal("1");
      expect(out.studentId).to.equal("s1");
    });

    it("validates ISO date strings and rejects bad ones", () => {
      expect(a.isValidDateISO("2023-01-01")).to.be.true;
      expect(a.isValidDateISO("2023-13-01")).to.be.false;
      expect(a.isValidDateISO("not-a-date")).to.be.false;
    });
  });

  describe("parseCsv", () => {
    it("parses csv with header and rows, and reports missing columns", () => {
      const text = "studentId,courseId,date,status\ns1,c1,2023-01-01,present\ns2,c1,2023-01-02,absent";
      const res = a.parseCsv(text);
      expect(res.rows).to.have.length(2);
      expect(res.errors).to.be.an("array").that.is.empty;
    });

    it("reports missing required fields and invalid dates", () => {
      const text = "studentId,courseId,date,status\ns1,,2023-01-01,present\ns2,c2,bad-date,absent";
      const res = a.parseCsv(text);
      expect(res.rows.length).to.be.at.least(0);
      // at least one error expected; check for substring matches
      expect(res.errors.join("|")).to.match(/missing|required|invalid/i);
    });

    it("reports missing columns in header", () => {
      const text = "studentId,courseId,status\ns1,c1,present";
      const res = a.parseCsv(text);
      expect(res.errors.join("|")).to.match(/missing columns|columns/i);
    });
  });

  describe("markStatus, summarizeStudent, findMissingDates, consecutiveAbsences", () => {
    it("inserts new status when not present", () => {
      const rows = [];
      const out = a.markStatus(rows, "s1", "c1", "2023-01-01", "present");
      expect(out.inserted).to.equal(1);
      expect(rows).to.have.length(1);
      expect(rows[0].status).to.equal("present");
    });

    it("skips when existing and not forced, updates when forced", () => {
      const rows = [{ studentId: "s1", courseId: "c1", date: "2023-01-02", status: "present" }];
      const skip = a.markStatus(rows, "s1", "c1", "2023-01-02", "absent", false);
      expect(skip.skipped).to.equal(1);
      const upd = a.markStatus(rows, "s1", "c1", "2023-01-02", "absent", true);
      expect(upd.updated).to.equal(1);
      expect(rows[0].status).to.equal("absent");
    });

    it("summarizes student attendance and calculates percentage", () => {
      const rows = [
        { studentId: "s1", courseId: "c1", date: "2023-01-01", status: "present" },
        { studentId: "s1", courseId: "c1", date: "2023-01-02", status: "absent" },
      ];
      const sum = a.summarizeStudent(rows, "s1");
      expect(sum.total).to.equal(2);
      expect(sum.present).to.equal(1);
      expect(sum.percentage).to.equal(50);
    });

    it("finds missing dates and computes consecutive absences", () => {
      const rows = [
        { studentId: "s1", date: "2023-01-01", status: "absent" },
        { studentId: "s1", date: "2023-01-02", status: "absent" },
        { studentId: "s1", date: "2023-01-03", status: "present" },
      ];
      expect(a.findMissingDates(rows, "s1", ["2023-01-01", "2023-01-02", "2023-01-04"])).to.deep.equal(["2023-01-04"]);
      expect(a.consecutiveAbsences(rows, "s1")).to.equal(2);
    });
  });
});
