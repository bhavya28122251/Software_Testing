// backend/test/unit/courseService.unit.test.js
const { expect } = require("chai");
const course = require("../../services/courseService");

describe("courseService", () => {
  describe("rowToCourse & normalizeCourseCode", () => {
    it("maps row to course and returns raw code; normalizeCourseCode normalizes", () => {
      const r = { id: "1", code: " cs 101 ", name: "Intro", instructor: "Jane", credits: 3 };
      const out = course.rowToCourse(r);
      // rowToCourse returns the raw code field (not trimmed) — assert that
      expect(out.id).to.equal("1");
      expect(out.code).to.equal(" cs 101 ");
      // normalization is done by normalizeCourseCode
      expect(course.normalizeCourseCode(out.code)).to.equal("CS101");
    });
  });

  describe("abbreviateCourseName & syllabusSnippet", () => {
    it("abbreviates when too long and preserves short names", () => {
      const long = "This is a very long course name that needs truncation";
      const ab = course.abbreviateCourseName(long, 20);
      expect(ab.length).to.be.at.most(20);
      expect(ab.endsWith("...") || ab.length <= 20).to.be.true;

      expect(course.abbreviateCourseName("Short", 20)).to.equal("Short");
    });

    it("syllabusSnippet returns full when under limit and truncated when over", () => {
      const s = "one two three";
      expect(course.syllabusSnippet(s, 5)).to.equal(s);

      const big = "a b c d e f g h i j";
      const snip = course.syllabusSnippet(big, 4);
      expect(snip.split(/\s+/)).to.have.length.at.most(4);
      expect(snip.endsWith("...")).to.be.true;
    });
  });

  describe("parseCourseCode & validateInstructorName", () => {
    it("parses normal codes and handles invalid", () => {
      expect(course.parseCourseCode("CS101")).to.deep.equal({ subject: "CS", number: "101" });
      expect(course.parseCourseCode("bad-format")).to.deep.equal({ subject: "bad-format", number: "" });
      expect(course.parseCourseCode("ee201")).to.deep.equal({ subject: "EE", number: "201" });
    });

    it("validates instructor names with allowed chars and rejects bad ones", () => {
      expect(course.validateInstructorName("Jane O'Neill")).to.be.true;
      expect(course.validateInstructorName("A")).to.be.false;
      expect(course.validateInstructorName("")).to.be.false;
    });
  });

  describe("isValidCredits, validateCoursePayload & buildCourseRecord", () => {
    it("checks credit boundaries", () => {
      expect(course.isValidCredits(0)).to.be.true;
      expect(course.isValidCredits(10)).to.be.true;
      expect(course.isValidCredits(-1)).to.be.false;
      expect(course.isValidCredits(11)).to.be.false;
    });

    it("validateCoursePayload enforces code/name and credit range", () => {
      expect(course.validateCoursePayload(null).ok).to.be.false;
      expect(course.validateCoursePayload({}).ok).to.be.false;
      expect(course.validateCoursePayload({ code: "CS1", name: "N", credits: 20 }).ok).to.be.false;
      expect(course.validateCoursePayload({ code: "CS1", name: "N", credits: 5 }).ok).to.be.true;
    });

    it("buildCourseRecord normalizes code and defaults credits", () => {
      const rec = course.buildCourseRecord({ code: " cs101 ", name: "Intro", instructor: "I" });
      expect(rec.code).to.equal("CS101");
      expect(rec.credits).to.equal(0);
    });
  });

  describe("matchesQuery", () => {
    it("matches code, name or instructor case-insensitively and handles missing fields", () => {
      const c = { code: "CS101", name: "Intro to CS", instructor: "Jane Doe" };
      expect(!!course.matchesQuery("cs101", c)).to.be.true;
      expect(!!course.matchesQuery("intro", c)).to.be.true;
      expect(!!course.matchesQuery("jane", c)).to.be.true;
      // when object is empty this returns undefined; coerce to boolean
      expect(!!course.matchesQuery("something", {})).to.be.false;
      expect(!!course.matchesQuery("algo", { code: null, name: "Algorithms" })).to.be.true;
    });
  });
});
