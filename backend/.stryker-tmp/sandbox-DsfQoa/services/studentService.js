// @ts-nocheck
// services/studentService.js
// Pure helpers & validators for student logic (no DB, no Express)
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
  if (stryMutAct_9fa48("231")) {
    {}
  } else {
    stryCov_9fa48("231");
    const f = firstName ? stryMutAct_9fa48("232") ? String(firstName) : (stryCov_9fa48("232"), String(firstName).trim()) : stryMutAct_9fa48("233") ? "Stryker was here!" : (stryCov_9fa48("233"), '');
    const l = lastName ? stryMutAct_9fa48("234") ? String(lastName) : (stryCov_9fa48("234"), String(lastName).trim()) : stryMutAct_9fa48("235") ? "Stryker was here!" : (stryCov_9fa48("235"), '');
    return stryMutAct_9fa48("236") ? `${f} ${l}` : (stryCov_9fa48("236"), (stryMutAct_9fa48("237") ? `` : (stryCov_9fa48("237"), `${f} ${l}`)).trim());
  }
}
function validateStudentPayload(payload = {}) {
  if (stryMutAct_9fa48("238")) {
    {}
  } else {
    stryCov_9fa48("238");
    const errors = stryMutAct_9fa48("239") ? ["Stryker was here"] : (stryCov_9fa48("239"), []);
    if (stryMutAct_9fa48("242") ? false : stryMutAct_9fa48("241") ? true : stryMutAct_9fa48("240") ? payload : (stryCov_9fa48("240", "241", "242"), !payload)) {
      if (stryMutAct_9fa48("243")) {
        {}
      } else {
        stryCov_9fa48("243");
        errors.push(stryMutAct_9fa48("244") ? "" : (stryCov_9fa48("244"), 'payload required'));
        return stryMutAct_9fa48("245") ? {} : (stryCov_9fa48("245"), {
          valid: stryMutAct_9fa48("246") ? true : (stryCov_9fa48("246"), false),
          errors
        });
      }
    }
    if (stryMutAct_9fa48("249") ? (!payload.firstName || typeof payload.firstName !== 'string') && !payload.firstName.trim() : stryMutAct_9fa48("248") ? false : stryMutAct_9fa48("247") ? true : (stryCov_9fa48("247", "248", "249"), (stryMutAct_9fa48("251") ? !payload.firstName && typeof payload.firstName !== 'string' : stryMutAct_9fa48("250") ? false : (stryCov_9fa48("250", "251"), (stryMutAct_9fa48("252") ? payload.firstName : (stryCov_9fa48("252"), !payload.firstName)) || (stryMutAct_9fa48("254") ? typeof payload.firstName === 'string' : stryMutAct_9fa48("253") ? false : (stryCov_9fa48("253", "254"), typeof payload.firstName !== (stryMutAct_9fa48("255") ? "" : (stryCov_9fa48("255"), 'string')))))) || (stryMutAct_9fa48("256") ? payload.firstName.trim() : (stryCov_9fa48("256"), !(stryMutAct_9fa48("257") ? payload.firstName : (stryCov_9fa48("257"), payload.firstName.trim())))))) errors.push(stryMutAct_9fa48("258") ? "" : (stryCov_9fa48("258"), 'firstName required'));
    if (stryMutAct_9fa48("261") ? (!payload.lastName || typeof payload.lastName !== 'string') && !payload.lastName.trim() : stryMutAct_9fa48("260") ? false : stryMutAct_9fa48("259") ? true : (stryCov_9fa48("259", "260", "261"), (stryMutAct_9fa48("263") ? !payload.lastName && typeof payload.lastName !== 'string' : stryMutAct_9fa48("262") ? false : (stryCov_9fa48("262", "263"), (stryMutAct_9fa48("264") ? payload.lastName : (stryCov_9fa48("264"), !payload.lastName)) || (stryMutAct_9fa48("266") ? typeof payload.lastName === 'string' : stryMutAct_9fa48("265") ? false : (stryCov_9fa48("265", "266"), typeof payload.lastName !== (stryMutAct_9fa48("267") ? "" : (stryCov_9fa48("267"), 'string')))))) || (stryMutAct_9fa48("268") ? payload.lastName.trim() : (stryCov_9fa48("268"), !(stryMutAct_9fa48("269") ? payload.lastName : (stryCov_9fa48("269"), payload.lastName.trim())))))) errors.push(stryMutAct_9fa48("270") ? "" : (stryCov_9fa48("270"), 'lastName required'));
    if (stryMutAct_9fa48("273") ? payload.email || typeof payload.email === 'string' : stryMutAct_9fa48("272") ? false : stryMutAct_9fa48("271") ? true : (stryCov_9fa48("271", "272", "273"), payload.email && (stryMutAct_9fa48("275") ? typeof payload.email !== 'string' : stryMutAct_9fa48("274") ? true : (stryCov_9fa48("274", "275"), typeof payload.email === (stryMutAct_9fa48("276") ? "" : (stryCov_9fa48("276"), 'string')))))) {
      if (stryMutAct_9fa48("277")) {
        {}
      } else {
        stryCov_9fa48("277");
        const re = stryMutAct_9fa48("288") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("287") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("286") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("285") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("284") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("283") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("282") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("281") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("280") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("279") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("278") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("278", "279", "280", "281", "282", "283", "284", "285", "286", "287", "288"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        if (stryMutAct_9fa48("291") ? false : stryMutAct_9fa48("290") ? true : stryMutAct_9fa48("289") ? re.test(payload.email) : (stryCov_9fa48("289", "290", "291"), !re.test(payload.email))) errors.push(stryMutAct_9fa48("292") ? "" : (stryCov_9fa48("292"), 'invalid email'));
      }
    }
    return stryMutAct_9fa48("293") ? {} : (stryCov_9fa48("293"), {
      valid: stryMutAct_9fa48("296") ? errors.length !== 0 : stryMutAct_9fa48("295") ? false : stryMutAct_9fa48("294") ? true : (stryCov_9fa48("294", "295", "296"), errors.length === 0),
      errors
    });
  }
}
function buildStudentRecord(payload = {}, now = Date.now()) {
  if (stryMutAct_9fa48("297")) {
    {}
  } else {
    stryCov_9fa48("297");
    // returns a plain object ready to insert into DB (doesn't call DB)
    const p = stryMutAct_9fa48("300") ? payload && {} : stryMutAct_9fa48("299") ? false : stryMutAct_9fa48("298") ? true : (stryCov_9fa48("298", "299", "300"), payload || {});
    return stryMutAct_9fa48("301") ? {} : (stryCov_9fa48("301"), {
      admissionNo: stryMutAct_9fa48("302") ? (p.admissionNo || '').toString() : (stryCov_9fa48("302"), (stryMutAct_9fa48("305") ? p.admissionNo && '' : stryMutAct_9fa48("304") ? false : stryMutAct_9fa48("303") ? true : (stryCov_9fa48("303", "304", "305"), p.admissionNo || (stryMutAct_9fa48("306") ? "Stryker was here!" : (stryCov_9fa48("306"), '')))).toString().trim()),
      firstName: stryMutAct_9fa48("307") ? (p.firstName || '').toString() : (stryCov_9fa48("307"), (stryMutAct_9fa48("310") ? p.firstName && '' : stryMutAct_9fa48("309") ? false : stryMutAct_9fa48("308") ? true : (stryCov_9fa48("308", "309", "310"), p.firstName || (stryMutAct_9fa48("311") ? "Stryker was here!" : (stryCov_9fa48("311"), '')))).toString().trim()),
      lastName: stryMutAct_9fa48("312") ? (p.lastName || '').toString() : (stryCov_9fa48("312"), (stryMutAct_9fa48("315") ? p.lastName && '' : stryMutAct_9fa48("314") ? false : stryMutAct_9fa48("313") ? true : (stryCov_9fa48("313", "314", "315"), p.lastName || (stryMutAct_9fa48("316") ? "Stryker was here!" : (stryCov_9fa48("316"), '')))).toString().trim()),
      dob: stryMutAct_9fa48("317") ? (p.dob || '').toString() : (stryCov_9fa48("317"), (stryMutAct_9fa48("320") ? p.dob && '' : stryMutAct_9fa48("319") ? false : stryMutAct_9fa48("318") ? true : (stryCov_9fa48("318", "319", "320"), p.dob || (stryMutAct_9fa48("321") ? "Stryker was here!" : (stryCov_9fa48("321"), '')))).toString().trim()),
      email: stryMutAct_9fa48("322") ? (p.email || '').toString() : (stryCov_9fa48("322"), (stryMutAct_9fa48("325") ? p.email && '' : stryMutAct_9fa48("324") ? false : stryMutAct_9fa48("323") ? true : (stryCov_9fa48("323", "324", "325"), p.email || (stryMutAct_9fa48("326") ? "Stryker was here!" : (stryCov_9fa48("326"), '')))).toString().trim()),
      phone: stryMutAct_9fa48("327") ? (p.phone || '').toString() : (stryCov_9fa48("327"), (stryMutAct_9fa48("330") ? p.phone && '' : stryMutAct_9fa48("329") ? false : stryMutAct_9fa48("328") ? true : (stryCov_9fa48("328", "329", "330"), p.phone || (stryMutAct_9fa48("331") ? "Stryker was here!" : (stryCov_9fa48("331"), '')))).toString().trim()),
      address: stryMutAct_9fa48("332") ? (p.address || '').toString() : (stryCov_9fa48("332"), (stryMutAct_9fa48("335") ? p.address && '' : stryMutAct_9fa48("334") ? false : stryMutAct_9fa48("333") ? true : (stryCov_9fa48("333", "334", "335"), p.address || (stryMutAct_9fa48("336") ? "Stryker was here!" : (stryCov_9fa48("336"), '')))).toString().trim()),
      year: stryMutAct_9fa48("337") ? (p.year || '').toString() : (stryCov_9fa48("337"), (stryMutAct_9fa48("340") ? p.year && '' : stryMutAct_9fa48("339") ? false : stryMutAct_9fa48("338") ? true : (stryCov_9fa48("338", "339", "340"), p.year || (stryMutAct_9fa48("341") ? "Stryker was here!" : (stryCov_9fa48("341"), '')))).toString().trim()),
      notes: stryMutAct_9fa48("342") ? (p.notes || '').toString() : (stryCov_9fa48("342"), (stryMutAct_9fa48("345") ? p.notes && '' : stryMutAct_9fa48("344") ? false : stryMutAct_9fa48("343") ? true : (stryCov_9fa48("343", "344", "345"), p.notes || (stryMutAct_9fa48("346") ? "Stryker was here!" : (stryCov_9fa48("346"), '')))).toString().trim()),
      createdAt: now,
      updatedAt: now
    });
  }
}
function rowToStudent(r = {}) {
  if (stryMutAct_9fa48("347")) {
    {}
  } else {
    stryCov_9fa48("347");
    if (stryMutAct_9fa48("350") ? false : stryMutAct_9fa48("349") ? true : stryMutAct_9fa48("348") ? r : (stryCov_9fa48("348", "349", "350"), !r)) return null;
    return stryMutAct_9fa48("351") ? {} : (stryCov_9fa48("351"), {
      id: r.id,
      admissionNo: stryMutAct_9fa48("354") ? r.admissionNo && '' : stryMutAct_9fa48("353") ? false : stryMutAct_9fa48("352") ? true : (stryCov_9fa48("352", "353", "354"), r.admissionNo || (stryMutAct_9fa48("355") ? "Stryker was here!" : (stryCov_9fa48("355"), ''))),
      firstName: stryMutAct_9fa48("358") ? r.firstName && '' : stryMutAct_9fa48("357") ? false : stryMutAct_9fa48("356") ? true : (stryCov_9fa48("356", "357", "358"), r.firstName || (stryMutAct_9fa48("359") ? "Stryker was here!" : (stryCov_9fa48("359"), ''))),
      lastName: stryMutAct_9fa48("362") ? r.lastName && '' : stryMutAct_9fa48("361") ? false : stryMutAct_9fa48("360") ? true : (stryCov_9fa48("360", "361", "362"), r.lastName || (stryMutAct_9fa48("363") ? "Stryker was here!" : (stryCov_9fa48("363"), ''))),
      fullName: formatFullName(r.firstName, r.lastName),
      dob: stryMutAct_9fa48("366") ? r.dob && '' : stryMutAct_9fa48("365") ? false : stryMutAct_9fa48("364") ? true : (stryCov_9fa48("364", "365", "366"), r.dob || (stryMutAct_9fa48("367") ? "Stryker was here!" : (stryCov_9fa48("367"), ''))),
      email: stryMutAct_9fa48("370") ? r.email && '' : stryMutAct_9fa48("369") ? false : stryMutAct_9fa48("368") ? true : (stryCov_9fa48("368", "369", "370"), r.email || (stryMutAct_9fa48("371") ? "Stryker was here!" : (stryCov_9fa48("371"), ''))),
      phone: stryMutAct_9fa48("374") ? r.phone && '' : stryMutAct_9fa48("373") ? false : stryMutAct_9fa48("372") ? true : (stryCov_9fa48("372", "373", "374"), r.phone || (stryMutAct_9fa48("375") ? "Stryker was here!" : (stryCov_9fa48("375"), ''))),
      address: stryMutAct_9fa48("378") ? r.address && '' : stryMutAct_9fa48("377") ? false : stryMutAct_9fa48("376") ? true : (stryCov_9fa48("376", "377", "378"), r.address || (stryMutAct_9fa48("379") ? "Stryker was here!" : (stryCov_9fa48("379"), ''))),
      year: stryMutAct_9fa48("382") ? r.year && '' : stryMutAct_9fa48("381") ? false : stryMutAct_9fa48("380") ? true : (stryCov_9fa48("380", "381", "382"), r.year || (stryMutAct_9fa48("383") ? "Stryker was here!" : (stryCov_9fa48("383"), ''))),
      notes: stryMutAct_9fa48("386") ? r.notes && '' : stryMutAct_9fa48("385") ? false : stryMutAct_9fa48("384") ? true : (stryCov_9fa48("384", "385", "386"), r.notes || (stryMutAct_9fa48("387") ? "Stryker was here!" : (stryCov_9fa48("387"), ''))),
      createdAt: stryMutAct_9fa48("390") ? r.createdAt && null : stryMutAct_9fa48("389") ? false : stryMutAct_9fa48("388") ? true : (stryCov_9fa48("388", "389", "390"), r.createdAt || null),
      updatedAt: stryMutAct_9fa48("393") ? r.updatedAt && null : stryMutAct_9fa48("392") ? false : stryMutAct_9fa48("391") ? true : (stryCov_9fa48("391", "392", "393"), r.updatedAt || null)
    });
  }
}
module.exports = stryMutAct_9fa48("394") ? {} : (stryCov_9fa48("394"), {
  formatFullName,
  validateStudentPayload,
  buildStudentRecord,
  rowToStudent
});