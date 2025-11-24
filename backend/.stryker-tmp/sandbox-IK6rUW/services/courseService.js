// @ts-nocheck
// services/courseService.js
// Pure helpers for course logic (no DB)
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
  if (stryMutAct_9fa48("121")) {
    {}
  } else {
    stryCov_9fa48("121");
    if (stryMutAct_9fa48("124") ? false : stryMutAct_9fa48("123") ? true : stryMutAct_9fa48("122") ? r : (stryCov_9fa48("122", "123", "124"), !r)) return null;
    return stryMutAct_9fa48("125") ? {} : (stryCov_9fa48("125"), {
      id: r.id,
      code: stryMutAct_9fa48("128") ? r.code && '' : stryMutAct_9fa48("127") ? false : stryMutAct_9fa48("126") ? true : (stryCov_9fa48("126", "127", "128"), r.code || (stryMutAct_9fa48("129") ? "Stryker was here!" : (stryCov_9fa48("129"), ''))),
      name: stryMutAct_9fa48("132") ? r.name && '' : stryMutAct_9fa48("131") ? false : stryMutAct_9fa48("130") ? true : (stryCov_9fa48("130", "131", "132"), r.name || (stryMutAct_9fa48("133") ? "Stryker was here!" : (stryCov_9fa48("133"), ''))),
      instructor: stryMutAct_9fa48("136") ? r.instructor && '' : stryMutAct_9fa48("135") ? false : stryMutAct_9fa48("134") ? true : (stryCov_9fa48("134", "135", "136"), r.instructor || (stryMutAct_9fa48("137") ? "Stryker was here!" : (stryCov_9fa48("137"), '')))
    });
  }
}
function normalizeCourseCode(code) {
  if (stryMutAct_9fa48("138")) {
    {}
  } else {
    stryCov_9fa48("138");
    if (stryMutAct_9fa48("141") ? false : stryMutAct_9fa48("140") ? true : stryMutAct_9fa48("139") ? code : (stryCov_9fa48("139", "140", "141"), !code)) return stryMutAct_9fa48("142") ? "Stryker was here!" : (stryCov_9fa48("142"), '');
    return stryMutAct_9fa48("143") ? String(code).toLowerCase().replace(/\s+/g, '') : (stryCov_9fa48("143"), String(code).toUpperCase().replace(stryMutAct_9fa48("145") ? /\S+/g : stryMutAct_9fa48("144") ? /\s/g : (stryCov_9fa48("144", "145"), /\s+/g), stryMutAct_9fa48("146") ? "Stryker was here!" : (stryCov_9fa48("146"), '')));
  }
}
function validateCoursePayload(payload = {}) {
  if (stryMutAct_9fa48("147")) {
    {}
  } else {
    stryCov_9fa48("147");
    if (stryMutAct_9fa48("150") ? false : stryMutAct_9fa48("149") ? true : stryMutAct_9fa48("148") ? payload : (stryCov_9fa48("148", "149", "150"), !payload)) return stryMutAct_9fa48("151") ? {} : (stryCov_9fa48("151"), {
      ok: stryMutAct_9fa48("152") ? true : (stryCov_9fa48("152"), false),
      reason: stryMutAct_9fa48("153") ? "" : (stryCov_9fa48("153"), 'no payload')
    });
    const code = stryMutAct_9fa48("154") ? (payload.code || '').toString() : (stryCov_9fa48("154"), (stryMutAct_9fa48("157") ? payload.code && '' : stryMutAct_9fa48("156") ? false : stryMutAct_9fa48("155") ? true : (stryCov_9fa48("155", "156", "157"), payload.code || (stryMutAct_9fa48("158") ? "Stryker was here!" : (stryCov_9fa48("158"), '')))).toString().trim());
    const name = stryMutAct_9fa48("159") ? (payload.name || '').toString() : (stryCov_9fa48("159"), (stryMutAct_9fa48("162") ? payload.name && '' : stryMutAct_9fa48("161") ? false : stryMutAct_9fa48("160") ? true : (stryCov_9fa48("160", "161", "162"), payload.name || (stryMutAct_9fa48("163") ? "Stryker was here!" : (stryCov_9fa48("163"), '')))).toString().trim());
    if (stryMutAct_9fa48("166") ? !code && !name : stryMutAct_9fa48("165") ? false : stryMutAct_9fa48("164") ? true : (stryCov_9fa48("164", "165", "166"), (stryMutAct_9fa48("167") ? code : (stryCov_9fa48("167"), !code)) || (stryMutAct_9fa48("168") ? name : (stryCov_9fa48("168"), !name)))) return stryMutAct_9fa48("169") ? {} : (stryCov_9fa48("169"), {
      ok: stryMutAct_9fa48("170") ? true : (stryCov_9fa48("170"), false),
      reason: stryMutAct_9fa48("171") ? "" : (stryCov_9fa48("171"), 'code and name required')
    });
    return stryMutAct_9fa48("172") ? {} : (stryCov_9fa48("172"), {
      ok: stryMutAct_9fa48("173") ? false : (stryCov_9fa48("173"), true)
    });
  }
}
function buildCourseRecord(payload = {}) {
  if (stryMutAct_9fa48("174")) {
    {}
  } else {
    stryCov_9fa48("174");
    const p = stryMutAct_9fa48("177") ? payload && {} : stryMutAct_9fa48("176") ? false : stryMutAct_9fa48("175") ? true : (stryCov_9fa48("175", "176", "177"), payload || {});
    return stryMutAct_9fa48("178") ? {} : (stryCov_9fa48("178"), {
      code: stryMutAct_9fa48("179") ? (p.code || '').toString() : (stryCov_9fa48("179"), (stryMutAct_9fa48("182") ? p.code && '' : stryMutAct_9fa48("181") ? false : stryMutAct_9fa48("180") ? true : (stryCov_9fa48("180", "181", "182"), p.code || (stryMutAct_9fa48("183") ? "Stryker was here!" : (stryCov_9fa48("183"), '')))).toString().trim()),
      name: stryMutAct_9fa48("184") ? (p.name || '').toString() : (stryCov_9fa48("184"), (stryMutAct_9fa48("187") ? p.name && '' : stryMutAct_9fa48("186") ? false : stryMutAct_9fa48("185") ? true : (stryCov_9fa48("185", "186", "187"), p.name || (stryMutAct_9fa48("188") ? "Stryker was here!" : (stryCov_9fa48("188"), '')))).toString().trim()),
      instructor: stryMutAct_9fa48("189") ? (p.instructor || '').toString() : (stryCov_9fa48("189"), (stryMutAct_9fa48("192") ? p.instructor && '' : stryMutAct_9fa48("191") ? false : stryMutAct_9fa48("190") ? true : (stryCov_9fa48("190", "191", "192"), p.instructor || (stryMutAct_9fa48("193") ? "Stryker was here!" : (stryCov_9fa48("193"), '')))).toString().trim()),
      credits: Number.isFinite(Number(p.credits)) ? Number(p.credits) : 0
    });
  }
}
module.exports = stryMutAct_9fa48("194") ? {} : (stryCov_9fa48("194"), {
  rowToCourse,
  normalizeCourseCode,
  validateCoursePayload,
  buildCourseRecord
});