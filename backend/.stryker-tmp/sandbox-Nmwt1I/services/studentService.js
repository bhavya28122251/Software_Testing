// @ts-nocheck
// services/studentService.js
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
function formatFullName(firstName, lastName) {
  if (stryMutAct_9fa48("557")) {
    {}
  } else {
    stryCov_9fa48("557");
    const f = firstName ? stryMutAct_9fa48("558") ? String(firstName) : (stryCov_9fa48("558"), String(firstName).trim()) : stryMutAct_9fa48("559") ? "Stryker was here!" : (stryCov_9fa48("559"), "");
    const l = lastName ? stryMutAct_9fa48("560") ? String(lastName) : (stryCov_9fa48("560"), String(lastName).trim()) : stryMutAct_9fa48("561") ? "Stryker was here!" : (stryCov_9fa48("561"), "");
    return stryMutAct_9fa48("562") ? `${f} ${l}` : (stryCov_9fa48("562"), (stryMutAct_9fa48("563") ? `` : (stryCov_9fa48("563"), `${f} ${l}`)).trim());
  }
}

// Capitalize each word (e.g., "raVi kumar" → "Ravi Kumar")
function normalizeName(name = stryMutAct_9fa48("564") ? "Stryker was here!" : (stryCov_9fa48("564"), "")) {
  if (stryMutAct_9fa48("565")) {
    {}
  } else {
    stryCov_9fa48("565");
    return stryMutAct_9fa48("566") ? String(name || "").split(/\s+/).map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(" ") : (stryCov_9fa48("566"), String(stryMutAct_9fa48("569") ? name && "" : stryMutAct_9fa48("568") ? false : stryMutAct_9fa48("567") ? true : (stryCov_9fa48("567", "568", "569"), name || (stryMutAct_9fa48("570") ? "Stryker was here!" : (stryCov_9fa48("570"), "")))).trim().split(/\s+/).map(stryMutAct_9fa48("573") ? () => undefined : (stryCov_9fa48("573"), part => (stryMutAct_9fa48("576") ? part.toUpperCase() : stryMutAct_9fa48("575") ? part.charAt(0).toLowerCase() : (stryCov_9fa48("575", "576"), part.charAt(0).toUpperCase())) + (stryMutAct_9fa48("578") ? part.toLowerCase() : stryMutAct_9fa48("577") ? part.slice(1).toUpperCase() : (stryCov_9fa48("577", "578"), part.slice(1).toLowerCase())))).join(stryMutAct_9fa48("579") ? "" : (stryCov_9fa48("579"), " ")));
  }
}

// Deterministic admission no (useful for testing)
function generateAdmissionNo(index = 0, base = 100) {
  if (stryMutAct_9fa48("580")) {
    {}
  } else {
    stryCov_9fa48("580");
    return stryMutAct_9fa48("581") ? `` : (stryCov_9fa48("581"), `ADM${base + Number(index)}`);
  }
}

// Basic email normalization
function normalizeEmail(email = stryMutAct_9fa48("583") ? "Stryker was here!" : (stryCov_9fa48("583"), "")) {
  if (stryMutAct_9fa48("584")) {
    {}
  } else {
    stryCov_9fa48("584");
    return stryMutAct_9fa48("586") ? String(email || "").toLowerCase() : stryMutAct_9fa48("585") ? String(email || "").trim().toUpperCase() : (stryCov_9fa48("585", "586"), String(stryMutAct_9fa48("589") ? email && "" : stryMutAct_9fa48("588") ? false : stryMutAct_9fa48("587") ? true : (stryCov_9fa48("587", "588", "589"), email || (stryMutAct_9fa48("590") ? "Stryker was here!" : (stryCov_9fa48("590"), "")))).trim().toLowerCase());
  }
}

// Mask email → ravi@example.com → r***i@example.com
function maskEmail(email = stryMutAct_9fa48("591") ? "Stryker was here!" : (stryCov_9fa48("591"), "")) {
  if (stryMutAct_9fa48("592")) {
    {}
  } else {
    stryCov_9fa48("592");
    const e = normalizeEmail(email);
    if (stryMutAct_9fa48("595") ? false : stryMutAct_9fa48("594") ? true : (stryCov_9fa48("594", "595"), !e.includes(stryMutAct_9fa48("596") ? "" : (stryCov_9fa48("596"), "@")))) return e;
    const [local, domain] = e.split(stryMutAct_9fa48("597") ? "" : (stryCov_9fa48("597"), "@"));
    if (stryMutAct_9fa48("601") ? local.length > 2 : stryMutAct_9fa48("600") ? local.length < 2 : stryMutAct_9fa48("599") ? false : stryMutAct_9fa48("598") ? true : (stryCov_9fa48("598", "599", "600", "601"), local.length <= 2)) return stryMutAct_9fa48("602") ? `` : (stryCov_9fa48("602"), `*@${domain}`);
    return stryMutAct_9fa48("603") ? `` : (stryCov_9fa48("603"), `${local[0]}${(stryMutAct_9fa48("604") ? "" : (stryCov_9fa48("604"), "*")).repeat(local.length - 2)}${local[local.length - 1]}@${domain}`);
  }
}
function validatePhone(phone = stryMutAct_9fa48("607") ? "Stryker was here!" : (stryCov_9fa48("607"), "")) {
  if (stryMutAct_9fa48("608")) {
    {}
  } else {
    stryCov_9fa48("608");
    const cleaned = phone.replace(/[\s\-()]/g, stryMutAct_9fa48("611") ? "Stryker was here!" : (stryCov_9fa48("611"), ""));
    return /^\+?\d{6,15}$/.test(cleaned);
  }
}

// Calculate age from dob
function calculateAge(dob) {
  if (stryMutAct_9fa48("617")) {
    {}
  } else {
    stryCov_9fa48("617");
    if (stryMutAct_9fa48("620") ? false : stryMutAct_9fa48("619") ? true : (stryCov_9fa48("619", "620"), !dob)) return null;
    const d = new Date(dob);
    if (stryMutAct_9fa48("622") ? false : stryMutAct_9fa48("621") ? true : (stryCov_9fa48("621", "622"), isNaN(d))) return null;
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    if (stryMutAct_9fa48("627") ? today >= new Date(today.getFullYear(), d.getMonth(), d.getDate()) : stryMutAct_9fa48("626") ? today <= new Date(today.getFullYear(), d.getMonth(), d.getDate()) : stryMutAct_9fa48("625") ? false : stryMutAct_9fa48("624") ? true : (stryCov_9fa48("624", "625", "626", "627"), today < new Date(today.getFullYear(), d.getMonth(), d.getDate()))) {
      if (stryMutAct_9fa48("628")) {
        {}
      } else {
        stryCov_9fa48("628");
        age--;
      }
    }
    return age;
  }
}
function isAdult(dob, limit = 18) {
  if (stryMutAct_9fa48("630")) {
    {}
  } else {
    stryCov_9fa48("630");
    const age = calculateAge(dob);
    return stryMutAct_9fa48("633") ? age !== null || age >= limit : stryMutAct_9fa48("632") ? false : stryMutAct_9fa48("631") ? true : (stryCov_9fa48("631", "632", "633"), (stryMutAct_9fa48("635") ? age === null : stryMutAct_9fa48("634") ? true : (stryCov_9fa48("634", "635"), age !== null)) && (stryMutAct_9fa48("638") ? age < limit : stryMutAct_9fa48("637") ? age > limit : stryMutAct_9fa48("636") ? true : (stryCov_9fa48("636", "637", "638"), age >= limit)));
  }
}

// Validation of student input
function validateStudentPayload(payload = {}) {
  if (stryMutAct_9fa48("639")) {
    {}
  } else {
    stryCov_9fa48("639");
    const errors = stryMutAct_9fa48("640") ? ["Stryker was here"] : (stryCov_9fa48("640"), []);
    if (stryMutAct_9fa48("643") ? false : stryMutAct_9fa48("642") ? true : (stryCov_9fa48("642", "643"), !payload.firstName)) errors.push(stryMutAct_9fa48("644") ? "" : (stryCov_9fa48("644"), "firstName required"));
    if (stryMutAct_9fa48("647") ? false : stryMutAct_9fa48("646") ? true : (stryCov_9fa48("646", "647"), !payload.lastName)) errors.push(stryMutAct_9fa48("648") ? "" : (stryCov_9fa48("648"), "lastName required"));
    if (stryMutAct_9fa48("650") ? false : stryMutAct_9fa48("649") ? true : (stryCov_9fa48("649", "650"), payload.email)) {
      if (stryMutAct_9fa48("651")) {
        {}
      } else {
        stryCov_9fa48("651");
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (stryMutAct_9fa48("665") ? false : stryMutAct_9fa48("664") ? true : (stryCov_9fa48("664", "665"), !re.test(payload.email))) errors.push(stryMutAct_9fa48("666") ? "" : (stryCov_9fa48("666"), "invalid email"));
      }
    }
    if (stryMutAct_9fa48("669") ? payload.phone || !validatePhone(payload.phone) : stryMutAct_9fa48("668") ? false : stryMutAct_9fa48("667") ? true : (stryCov_9fa48("667", "668", "669"), payload.phone && !validatePhone(payload.phone))) errors.push(stryMutAct_9fa48("671") ? "" : (stryCov_9fa48("671"), "invalid phone"));
    return {
      valid: stryMutAct_9fa48("675") ? errors.length !== 0 : stryMutAct_9fa48("674") ? false : stryMutAct_9fa48("673") ? true : (stryCov_9fa48("673", "674", "675"), errors.length === 0),
      errors
    };
  }
}

// Build student DB object
function buildStudentRecord(payload = {}, now = Date.now()) {
  if (stryMutAct_9fa48("676")) {
    {}
  } else {
    stryCov_9fa48("676");
    return {
      admissionNo: stryMutAct_9fa48("680") ? payload.admissionNo && "" : stryMutAct_9fa48("679") ? false : stryMutAct_9fa48("678") ? true : (stryCov_9fa48("678", "679", "680"), payload.admissionNo || (stryMutAct_9fa48("681") ? "Stryker was here!" : (stryCov_9fa48("681"), ""))),
      firstName: stryMutAct_9fa48("684") ? payload.firstName && "" : stryMutAct_9fa48("683") ? false : stryMutAct_9fa48("682") ? true : (stryCov_9fa48("682", "683", "684"), payload.firstName || (stryMutAct_9fa48("685") ? "Stryker was here!" : (stryCov_9fa48("685"), ""))),
      lastName: stryMutAct_9fa48("688") ? payload.lastName && "" : stryMutAct_9fa48("687") ? false : stryMutAct_9fa48("686") ? true : (stryCov_9fa48("686", "687", "688"), payload.lastName || (stryMutAct_9fa48("689") ? "Stryker was here!" : (stryCov_9fa48("689"), ""))),
      dob: stryMutAct_9fa48("692") ? payload.dob && "" : stryMutAct_9fa48("691") ? false : stryMutAct_9fa48("690") ? true : (stryCov_9fa48("690", "691", "692"), payload.dob || (stryMutAct_9fa48("693") ? "Stryker was here!" : (stryCov_9fa48("693"), ""))),
      email: normalizeEmail(stryMutAct_9fa48("696") ? payload.email && "" : stryMutAct_9fa48("695") ? false : stryMutAct_9fa48("694") ? true : (stryCov_9fa48("694", "695", "696"), payload.email || (stryMutAct_9fa48("697") ? "Stryker was here!" : (stryCov_9fa48("697"), "")))),
      phone: stryMutAct_9fa48("700") ? payload.phone && "" : stryMutAct_9fa48("699") ? false : stryMutAct_9fa48("698") ? true : (stryCov_9fa48("698", "699", "700"), payload.phone || (stryMutAct_9fa48("701") ? "Stryker was here!" : (stryCov_9fa48("701"), ""))),
      address: stryMutAct_9fa48("704") ? payload.address && "" : stryMutAct_9fa48("703") ? false : stryMutAct_9fa48("702") ? true : (stryCov_9fa48("702", "703", "704"), payload.address || (stryMutAct_9fa48("705") ? "Stryker was here!" : (stryCov_9fa48("705"), ""))),
      year: stryMutAct_9fa48("708") ? payload.year && "" : stryMutAct_9fa48("707") ? false : stryMutAct_9fa48("706") ? true : (stryCov_9fa48("706", "707", "708"), payload.year || (stryMutAct_9fa48("709") ? "Stryker was here!" : (stryCov_9fa48("709"), ""))),
      notes: stryMutAct_9fa48("712") ? payload.notes && "" : stryMutAct_9fa48("711") ? false : stryMutAct_9fa48("710") ? true : (stryCov_9fa48("710", "711", "712"), payload.notes || (stryMutAct_9fa48("713") ? "Stryker was here!" : (stryCov_9fa48("713"), ""))),
      createdAt: now,
      updatedAt: now
    };
  }
}
function rowToStudent(r = {}) {
  if (stryMutAct_9fa48("714")) {
    {}
  } else {
    stryCov_9fa48("714");
    if (stryMutAct_9fa48("717") ? false : stryMutAct_9fa48("716") ? true : (stryCov_9fa48("716", "717"), !r)) return null;
    return {
      id: r.id,
      admissionNo: r.admissionNo,
      firstName: r.firstName,
      lastName: r.lastName,
      fullName: formatFullName(r.firstName, r.lastName),
      email: r.email,
      emailMasked: maskEmail(r.email),
      year: r.year,
      phone: r.phone
    };
  }
}

// Sorting students
function compareStudents(a = {}, b = {}) {
  if (stryMutAct_9fa48("719")) {
    {}
  } else {
    stryCov_9fa48("719");
    const la = stryMutAct_9fa48("720") ? (a.lastName || "").toUpperCase() : (stryCov_9fa48("720"), (stryMutAct_9fa48("723") ? a.lastName && "" : stryMutAct_9fa48("722") ? false : stryMutAct_9fa48("721") ? true : (stryCov_9fa48("721", "722", "723"), a.lastName || (stryMutAct_9fa48("724") ? "Stryker was here!" : (stryCov_9fa48("724"), "")))).toLowerCase());
    const lb = stryMutAct_9fa48("725") ? (b.lastName || "").toUpperCase() : (stryCov_9fa48("725"), (stryMutAct_9fa48("728") ? b.lastName && "" : stryMutAct_9fa48("727") ? false : stryMutAct_9fa48("726") ? true : (stryCov_9fa48("726", "727", "728"), b.lastName || (stryMutAct_9fa48("729") ? "Stryker was here!" : (stryCov_9fa48("729"), "")))).toLowerCase());
    if (stryMutAct_9fa48("733") ? la >= lb : stryMutAct_9fa48("732") ? la <= lb : stryMutAct_9fa48("731") ? false : stryMutAct_9fa48("730") ? true : (stryCov_9fa48("730", "731", "732", "733"), la < lb)) return -1;
    if (stryMutAct_9fa48("738") ? la <= lb : stryMutAct_9fa48("737") ? la >= lb : stryMutAct_9fa48("736") ? false : stryMutAct_9fa48("735") ? true : (stryCov_9fa48("735", "736", "737", "738"), la > lb)) return 1;
    return (stryMutAct_9fa48("741") ? a.firstName && "" : stryMutAct_9fa48("740") ? false : stryMutAct_9fa48("739") ? true : (stryCov_9fa48("739", "740", "741"), a.firstName || (stryMutAct_9fa48("742") ? "Stryker was here!" : (stryCov_9fa48("742"), "")))).localeCompare(stryMutAct_9fa48("745") ? b.firstName && "" : stryMutAct_9fa48("744") ? false : stryMutAct_9fa48("743") ? true : (stryCov_9fa48("743", "744", "745"), b.firstName || (stryMutAct_9fa48("746") ? "Stryker was here!" : (stryCov_9fa48("746"), ""))));
  }
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
  compareStudents
};