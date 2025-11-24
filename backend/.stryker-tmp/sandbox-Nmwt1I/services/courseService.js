// @ts-nocheck
// services/courseService.js
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
function rowToCourse(r = {}) {
  if (stryMutAct_9fa48("400")) {
    {}
  } else {
    stryCov_9fa48("400");
    return {
      id: r.id,
      code: stryMutAct_9fa48("404") ? r.code && "" : stryMutAct_9fa48("403") ? false : stryMutAct_9fa48("402") ? true : (stryCov_9fa48("402", "403", "404"), r.code || (stryMutAct_9fa48("405") ? "Stryker was here!" : (stryCov_9fa48("405"), ""))),
      name: stryMutAct_9fa48("408") ? r.name && "" : stryMutAct_9fa48("407") ? false : stryMutAct_9fa48("406") ? true : (stryCov_9fa48("406", "407", "408"), r.name || (stryMutAct_9fa48("409") ? "Stryker was here!" : (stryCov_9fa48("409"), ""))),
      instructor: stryMutAct_9fa48("412") ? r.instructor && "" : stryMutAct_9fa48("411") ? false : stryMutAct_9fa48("410") ? true : (stryCov_9fa48("410", "411", "412"), r.instructor || (stryMutAct_9fa48("413") ? "Stryker was here!" : (stryCov_9fa48("413"), ""))),
      credits: stryMutAct_9fa48("416") ? r.credits && 0 : stryMutAct_9fa48("415") ? false : stryMutAct_9fa48("414") ? true : (stryCov_9fa48("414", "415", "416"), r.credits || 0)
    };
  }
}
function normalizeCourseCode(code = stryMutAct_9fa48("417") ? "Stryker was here!" : (stryCov_9fa48("417"), "")) {
  if (stryMutAct_9fa48("418")) {
    {}
  } else {
    stryCov_9fa48("418");
    return stryMutAct_9fa48("419") ? code.toLowerCase().replace(/\s+/g, "") : (stryCov_9fa48("419"), code.toUpperCase().replace(/\s+/g, stryMutAct_9fa48("422") ? "Stryker was here!" : (stryCov_9fa48("422"), "")));
  }
}

// Cut long course name
function abbreviateCourseName(name = stryMutAct_9fa48("423") ? "Stryker was here!" : (stryCov_9fa48("423"), ""), len = 20) {
  if (stryMutAct_9fa48("424")) {
    {}
  } else {
    stryCov_9fa48("424");
    return (stryMutAct_9fa48("428") ? name.length > len : stryMutAct_9fa48("427") ? name.length < len : stryMutAct_9fa48("426") ? false : stryMutAct_9fa48("425") ? true : (stryCov_9fa48("425", "426", "427", "428"), name.length <= len)) ? name : (stryMutAct_9fa48("429") ? name : (stryCov_9fa48("429"), name.slice(0, len - 3))) + (stryMutAct_9fa48("431") ? "" : (stryCov_9fa48("431"), "..."));
  }
}

// Split "CS101" → {subject: "CS", number: "101"}
function parseCourseCode(code = stryMutAct_9fa48("432") ? "Stryker was here!" : (stryCov_9fa48("432"), "")) {
  if (stryMutAct_9fa48("433")) {
    {}
  } else {
    stryCov_9fa48("433");
    const m = stryMutAct_9fa48("434") ? code.toLowerCase().match(/^([A-Z]+)(\d+)$/) : (stryCov_9fa48("434"), code.toUpperCase().match(/^([A-Z]+)(\d+)$/));
    return m ? {
      subject: m[1],
      number: m[2]
    } : {
      subject: code,
      number: stryMutAct_9fa48("443") ? "Stryker was here!" : (stryCov_9fa48("443"), "")
    };
  }
}
function syllabusSnippet(text = stryMutAct_9fa48("444") ? "Stryker was here!" : (stryCov_9fa48("444"), ""), words = 20) {
  if (stryMutAct_9fa48("445")) {
    {}
  } else {
    stryCov_9fa48("445");
    const parts = stryMutAct_9fa48("446") ? text.split(/\s+/) : (stryCov_9fa48("446"), text.trim().split(/\s+/));
    return (stryMutAct_9fa48("452") ? parts.length > words : stryMutAct_9fa48("451") ? parts.length < words : stryMutAct_9fa48("450") ? false : stryMutAct_9fa48("449") ? true : (stryCov_9fa48("449", "450", "451", "452"), parts.length <= words)) ? text : (stryMutAct_9fa48("453") ? parts.join(" ") : (stryCov_9fa48("453"), parts.slice(0, words).join(stryMutAct_9fa48("454") ? "" : (stryCov_9fa48("454"), " ")))) + (stryMutAct_9fa48("455") ? "" : (stryCov_9fa48("455"), "..."));
  }
}
function validateInstructorName(name = stryMutAct_9fa48("456") ? "Stryker was here!" : (stryCov_9fa48("456"), "")) {
  if (stryMutAct_9fa48("457")) {
    {}
  } else {
    stryCov_9fa48("457");
    return /^[A-Za-z .'-]{2,100}$/.test(stryMutAct_9fa48("462") ? name : (stryCov_9fa48("462"), name.trim()));
  }
}
function isValidCredits(c) {
  if (stryMutAct_9fa48("463")) {
    {}
  } else {
    stryCov_9fa48("463");
    return stryMutAct_9fa48("466") ? Number(c) >= 0 || Number(c) <= 10 : stryMutAct_9fa48("465") ? false : stryMutAct_9fa48("464") ? true : (stryCov_9fa48("464", "465", "466"), (stryMutAct_9fa48("469") ? Number(c) < 0 : stryMutAct_9fa48("468") ? Number(c) > 0 : stryMutAct_9fa48("467") ? true : (stryCov_9fa48("467", "468", "469"), Number(c) >= 0)) && (stryMutAct_9fa48("472") ? Number(c) > 10 : stryMutAct_9fa48("471") ? Number(c) < 10 : stryMutAct_9fa48("470") ? true : (stryCov_9fa48("470", "471", "472"), Number(c) <= 10)));
  }
}
function validateCoursePayload(p = {}) {
  if (stryMutAct_9fa48("473")) {
    {}
  } else {
    stryCov_9fa48("473");
    if (stryMutAct_9fa48("476") ? !p.code && !p.name : stryMutAct_9fa48("475") ? false : stryMutAct_9fa48("474") ? true : (stryCov_9fa48("474", "475", "476"), !p.code || !p.name)) return {
      ok: false
    };
    if (stryMutAct_9fa48("483") ? p.credits || !isValidCredits(p.credits) : stryMutAct_9fa48("482") ? false : stryMutAct_9fa48("481") ? true : (stryCov_9fa48("481", "482", "483"), p.credits && !isValidCredits(p.credits))) return {
      ok: false
    };
    return {
      ok: true
    };
  }
}
function matchesQuery(q = stryMutAct_9fa48("489") ? "Stryker was here!" : (stryCov_9fa48("489"), ""), course = {}) {
  if (stryMutAct_9fa48("490")) {
    {}
  } else {
    stryCov_9fa48("490");
    q = stryMutAct_9fa48("491") ? q.toUpperCase() : (stryCov_9fa48("491"), q.toLowerCase());
    return stryMutAct_9fa48("494") ? (course.code?.toLowerCase().includes(q) || course.name?.toLowerCase().includes(q)) && course.instructor?.toLowerCase().includes(q) : stryMutAct_9fa48("493") ? false : stryMutAct_9fa48("492") ? true : (stryCov_9fa48("492", "493", "494"), (stryMutAct_9fa48("496") ? course.code?.toLowerCase().includes(q) && course.name?.toLowerCase().includes(q) : stryMutAct_9fa48("495") ? false : (stryCov_9fa48("495", "496"), (stryMutAct_9fa48("498") ? course.code.toLowerCase().includes(q) : stryMutAct_9fa48("497") ? course.code?.toUpperCase().includes(q) : (stryCov_9fa48("497", "498"), course.code?.toLowerCase().includes(q))) || (stryMutAct_9fa48("500") ? course.name.toLowerCase().includes(q) : stryMutAct_9fa48("499") ? course.name?.toUpperCase().includes(q) : (stryCov_9fa48("499", "500"), course.name?.toLowerCase().includes(q))))) || (stryMutAct_9fa48("502") ? course.instructor.toLowerCase().includes(q) : stryMutAct_9fa48("501") ? course.instructor?.toUpperCase().includes(q) : (stryCov_9fa48("501", "502"), course.instructor?.toLowerCase().includes(q))));
  }
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
  matchesQuery
};