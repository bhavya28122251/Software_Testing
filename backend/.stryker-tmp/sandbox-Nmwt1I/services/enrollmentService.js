// @ts-nocheck
// services/enrollmentService.js
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
function validateEnrollment(payload = {}) {
  if (stryMutAct_9fa48("504")) {
    {}
  } else {
    stryCov_9fa48("504");
    if (stryMutAct_9fa48("507") ? !payload.studentId && !payload.courseId : stryMutAct_9fa48("506") ? false : stryMutAct_9fa48("505") ? true : (stryCov_9fa48("505", "506", "507"), !payload.studentId || !payload.courseId)) return {
      ok: false
    };
    return {
      ok: true
    };
  }
}
function buildEnrollmentRecord(p = {}) {
  if (stryMutAct_9fa48("514")) {
    {}
  } else {
    stryCov_9fa48("514");
    if (stryMutAct_9fa48("517") ? !p.studentId && !p.courseId : stryMutAct_9fa48("516") ? false : stryMutAct_9fa48("515") ? true : (stryCov_9fa48("515", "516", "517"), !p.studentId || !p.courseId)) throw new Error(stryMutAct_9fa48("520") ? "" : (stryCov_9fa48("520"), "Missing IDs"));
    return {
      studentId: p.studentId,
      courseId: p.courseId,
      enrolledAt: stryMutAct_9fa48("524") ? p.enrolledAt && Date.now() : stryMutAct_9fa48("523") ? false : stryMutAct_9fa48("522") ? true : (stryCov_9fa48("522", "523", "524"), p.enrolledAt || Date.now())
    };
  }
}

// "S1::C1"
function enrollmentKey(studentId, courseId) {
  if (stryMutAct_9fa48("525")) {
    {}
  } else {
    stryCov_9fa48("525");
    return stryMutAct_9fa48("526") ? `` : (stryCov_9fa48("526"), `${studentId}::${courseId}`);
  }
}
function isSameEnrollment(a, b) {
  if (stryMutAct_9fa48("527")) {
    {}
  } else {
    stryCov_9fa48("527");
    return stryMutAct_9fa48("530") ? enrollmentKey(a.studentId, a.courseId) !== enrollmentKey(b.studentId, b.courseId) : stryMutAct_9fa48("529") ? false : stryMutAct_9fa48("528") ? true : (stryCov_9fa48("528", "529", "530"), enrollmentKey(a.studentId, a.courseId) === enrollmentKey(b.studentId, b.courseId));
  }
}
function canEnroll(list = stryMutAct_9fa48("531") ? ["Stryker was here"] : (stryCov_9fa48("531"), []), studentId, courseId) {
  if (stryMutAct_9fa48("532")) {
    {}
  } else {
    stryCov_9fa48("532");
    return !(stryMutAct_9fa48("534") ? list.every(e => e.studentId === studentId && e.courseId === courseId) : (stryCov_9fa48("534"), list.some(stryMutAct_9fa48("535") ? () => undefined : (stryCov_9fa48("535"), e => stryMutAct_9fa48("538") ? e.studentId === studentId || e.courseId === courseId : stryMutAct_9fa48("537") ? false : stryMutAct_9fa48("536") ? true : (stryCov_9fa48("536", "537", "538"), (stryMutAct_9fa48("540") ? e.studentId !== studentId : stryMutAct_9fa48("539") ? true : (stryCov_9fa48("539", "540"), e.studentId === studentId)) && (stryMutAct_9fa48("542") ? e.courseId !== courseId : stryMutAct_9fa48("541") ? true : (stryCov_9fa48("541", "542"), e.courseId === courseId)))))));
  }
}
function buildEnrollmentRecords(list = stryMutAct_9fa48("543") ? ["Stryker was here"] : (stryCov_9fa48("543"), [])) {
  if (stryMutAct_9fa48("544")) {
    {}
  } else {
    stryCov_9fa48("544");
    return stryMutAct_9fa48("545") ? list.map(p => {
      try {
        return buildEnrollmentRecord(p);
      } catch {
        return null;
      }
    }) : (stryCov_9fa48("545"), list.map(p => {
      if (stryMutAct_9fa48("546")) {
        {}
      } else {
        stryCov_9fa48("546");
        try {
          if (stryMutAct_9fa48("547")) {
            {}
          } else {
            stryCov_9fa48("547");
            return buildEnrollmentRecord(p);
          }
        } catch {
          if (stryMutAct_9fa48("548")) {
            {}
          } else {
            stryCov_9fa48("548");
            return null;
          }
        }
      }
    }).filter(Boolean));
  }
}
function removeEnrollmentById(arr = stryMutAct_9fa48("549") ? ["Stryker was here"] : (stryCov_9fa48("549"), []), id) {
  if (stryMutAct_9fa48("550")) {
    {}
  } else {
    stryCov_9fa48("550");
    return stryMutAct_9fa48("551") ? arr : (stryCov_9fa48("551"), arr.filter(stryMutAct_9fa48("552") ? () => undefined : (stryCov_9fa48("552"), e => stryMutAct_9fa48("555") ? e.id === id : stryMutAct_9fa48("554") ? false : stryMutAct_9fa48("553") ? true : (stryCov_9fa48("553", "554", "555"), e.id !== id))));
  }
}
module.exports = {
  validateEnrollment,
  buildEnrollmentRecord,
  enrollmentKey,
  isSameEnrollment,
  canEnroll,
  buildEnrollmentRecords,
  removeEnrollmentById
};