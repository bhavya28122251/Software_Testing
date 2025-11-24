// @ts-nocheck
// services/enrollmentService.js
// Pure helpers for enrollment logic (no DB)
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
  if (stryMutAct_9fa48("195")) {
    {}
  } else {
    stryCov_9fa48("195");
    if (stryMutAct_9fa48("198") ? false : stryMutAct_9fa48("197") ? true : stryMutAct_9fa48("196") ? payload : (stryCov_9fa48("196", "197", "198"), !payload)) return stryMutAct_9fa48("199") ? {} : (stryCov_9fa48("199"), {
      ok: stryMutAct_9fa48("200") ? true : (stryCov_9fa48("200"), false),
      reason: stryMutAct_9fa48("201") ? "" : (stryCov_9fa48("201"), 'no payload')
    });
    const studentId = stryMutAct_9fa48("202") ? (payload.studentId || '').toString() : (stryCov_9fa48("202"), (stryMutAct_9fa48("205") ? payload.studentId && '' : stryMutAct_9fa48("204") ? false : stryMutAct_9fa48("203") ? true : (stryCov_9fa48("203", "204", "205"), payload.studentId || (stryMutAct_9fa48("206") ? "Stryker was here!" : (stryCov_9fa48("206"), '')))).toString().trim());
    const courseId = stryMutAct_9fa48("207") ? (payload.courseId || '').toString() : (stryCov_9fa48("207"), (stryMutAct_9fa48("210") ? payload.courseId && '' : stryMutAct_9fa48("209") ? false : stryMutAct_9fa48("208") ? true : (stryCov_9fa48("208", "209", "210"), payload.courseId || (stryMutAct_9fa48("211") ? "Stryker was here!" : (stryCov_9fa48("211"), '')))).toString().trim());
    if (stryMutAct_9fa48("214") ? !studentId && !courseId : stryMutAct_9fa48("213") ? false : stryMutAct_9fa48("212") ? true : (stryCov_9fa48("212", "213", "214"), (stryMutAct_9fa48("215") ? studentId : (stryCov_9fa48("215"), !studentId)) || (stryMutAct_9fa48("216") ? courseId : (stryCov_9fa48("216"), !courseId)))) return stryMutAct_9fa48("217") ? {} : (stryCov_9fa48("217"), {
      ok: stryMutAct_9fa48("218") ? true : (stryCov_9fa48("218"), false),
      reason: stryMutAct_9fa48("219") ? "" : (stryCov_9fa48("219"), 'missing ids')
    });
    return stryMutAct_9fa48("220") ? {} : (stryCov_9fa48("220"), {
      ok: stryMutAct_9fa48("221") ? false : (stryCov_9fa48("221"), true)
    });
  }
}
function buildEnrollmentRecord(payload = {}) {
  if (stryMutAct_9fa48("222")) {
    {}
  } else {
    stryCov_9fa48("222");
    const v = validateEnrollment(payload);
    if (stryMutAct_9fa48("225") ? false : stryMutAct_9fa48("224") ? true : stryMutAct_9fa48("223") ? v.ok : (stryCov_9fa48("223", "224", "225"), !v.ok)) throw new Error(v.reason);
    return stryMutAct_9fa48("226") ? {} : (stryCov_9fa48("226"), {
      studentId: payload.studentId,
      courseId: payload.courseId,
      enrolledAt: stryMutAct_9fa48("229") ? payload.enrolledAt && Date.now() : stryMutAct_9fa48("228") ? false : stryMutAct_9fa48("227") ? true : (stryCov_9fa48("227", "228", "229"), payload.enrolledAt || Date.now())
    });
  }
}
module.exports = stryMutAct_9fa48("230") ? {} : (stryCov_9fa48("230"), {
  validateEnrollment,
  buildEnrollmentRecord
});