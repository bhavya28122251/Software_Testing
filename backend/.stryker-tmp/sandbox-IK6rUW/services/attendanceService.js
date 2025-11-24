// @ts-nocheck
// services/attendanceService.js
// Pure helpers for attendance logic (no DB/Express)
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
function rowToAttendance(r = null) {
  if (stryMutAct_9fa48("0")) {
    {}
  } else {
    stryCov_9fa48("0");
    if (stryMutAct_9fa48("3") ? false : stryMutAct_9fa48("2") ? true : stryMutAct_9fa48("1") ? r : (stryCov_9fa48("1", "2", "3"), !r)) return null;
    return stryMutAct_9fa48("4") ? {} : (stryCov_9fa48("4"), {
      id: r.id,
      studentId: r.studentId,
      courseId: r.courseId,
      date: r.date,
      status: r.status
    });
  }
}
function isValidDateISO(dateStr) {
  if (stryMutAct_9fa48("5")) {
    {}
  } else {
    stryCov_9fa48("5");
    if (stryMutAct_9fa48("8") ? typeof dateStr === 'string' : stryMutAct_9fa48("7") ? false : stryMutAct_9fa48("6") ? true : (stryCov_9fa48("6", "7", "8"), typeof dateStr !== (stryMutAct_9fa48("9") ? "" : (stryCov_9fa48("9"), 'string')))) return stryMutAct_9fa48("10") ? true : (stryCov_9fa48("10"), false);
    const m = (stryMutAct_9fa48("18") ? /^\d{4}-\d{2}-\D{2}$/ : stryMutAct_9fa48("17") ? /^\d{4}-\d{2}-\d$/ : stryMutAct_9fa48("16") ? /^\d{4}-\D{2}-\d{2}$/ : stryMutAct_9fa48("15") ? /^\d{4}-\d-\d{2}$/ : stryMutAct_9fa48("14") ? /^\D{4}-\d{2}-\d{2}$/ : stryMutAct_9fa48("13") ? /^\d-\d{2}-\d{2}$/ : stryMutAct_9fa48("12") ? /^\d{4}-\d{2}-\d{2}/ : stryMutAct_9fa48("11") ? /\d{4}-\d{2}-\d{2}$/ : (stryCov_9fa48("11", "12", "13", "14", "15", "16", "17", "18"), /^\d{4}-\d{2}-\d{2}$/)).exec(dateStr);
    if (stryMutAct_9fa48("21") ? false : stryMutAct_9fa48("20") ? true : stryMutAct_9fa48("19") ? m : (stryCov_9fa48("19", "20", "21"), !m)) return stryMutAct_9fa48("22") ? true : (stryCov_9fa48("22"), false);
    const d = new Date(dateStr);
    if (stryMutAct_9fa48("24") ? false : stryMutAct_9fa48("23") ? true : (stryCov_9fa48("23", "24"), Number.isNaN(d.getTime()))) return stryMutAct_9fa48("25") ? true : (stryCov_9fa48("25"), false);
    return stryMutAct_9fa48("28") ? d.toISOString().slice(0, 10) !== dateStr : stryMutAct_9fa48("27") ? false : stryMutAct_9fa48("26") ? true : (stryCov_9fa48("26", "27", "28"), (stryMutAct_9fa48("29") ? d.toISOString() : (stryCov_9fa48("29"), d.toISOString().slice(0, 10))) === dateStr);
  }
}
function parseCsv(content = stryMutAct_9fa48("30") ? "Stryker was here!" : (stryCov_9fa48("30"), '')) {
  if (stryMutAct_9fa48("31")) {
    {}
  } else {
    stryCov_9fa48("31");
    const lines = stryMutAct_9fa48("32") ? content.split(/\r?\n/).map(l => l.trim()) : (stryCov_9fa48("32"), content.split(stryMutAct_9fa48("33") ? /\r\n/ : (stryCov_9fa48("33"), /\r?\n/)).map(stryMutAct_9fa48("34") ? () => undefined : (stryCov_9fa48("34"), l => stryMutAct_9fa48("35") ? l : (stryCov_9fa48("35"), l.trim()))).filter(stryMutAct_9fa48("36") ? () => undefined : (stryCov_9fa48("36"), l => stryMutAct_9fa48("40") ? l.length <= 0 : stryMutAct_9fa48("39") ? l.length >= 0 : stryMutAct_9fa48("38") ? false : stryMutAct_9fa48("37") ? true : (stryCov_9fa48("37", "38", "39", "40"), l.length > 0))));
    const result = stryMutAct_9fa48("41") ? ["Stryker was here"] : (stryCov_9fa48("41"), []);
    const errors = stryMutAct_9fa48("42") ? ["Stryker was here"] : (stryCov_9fa48("42"), []);
    if (stryMutAct_9fa48("45") ? lines.length !== 0 : stryMutAct_9fa48("44") ? false : stryMutAct_9fa48("43") ? true : (stryCov_9fa48("43", "44", "45"), lines.length === 0)) {
      if (stryMutAct_9fa48("46")) {
        {}
      } else {
        stryCov_9fa48("46");
        errors.push(stryMutAct_9fa48("47") ? "" : (stryCov_9fa48("47"), 'empty csv'));
        return stryMutAct_9fa48("48") ? {} : (stryCov_9fa48("48"), {
          rows: result,
          errors
        });
      }
    }
    const header = lines[0].split(stryMutAct_9fa48("49") ? "" : (stryCov_9fa48("49"), ',')).map(stryMutAct_9fa48("50") ? () => undefined : (stryCov_9fa48("50"), h => stryMutAct_9fa48("51") ? h : (stryCov_9fa48("51"), h.trim())));
    const required = stryMutAct_9fa48("52") ? [] : (stryCov_9fa48("52"), [stryMutAct_9fa48("53") ? "" : (stryCov_9fa48("53"), 'studentId'), stryMutAct_9fa48("54") ? "" : (stryCov_9fa48("54"), 'courseId'), stryMutAct_9fa48("55") ? "" : (stryCov_9fa48("55"), 'date'), stryMutAct_9fa48("56") ? "" : (stryCov_9fa48("56"), 'status')]);
    const hasRequired = stryMutAct_9fa48("57") ? required.some(k => header.includes(k)) : (stryCov_9fa48("57"), required.every(stryMutAct_9fa48("58") ? () => undefined : (stryCov_9fa48("58"), k => header.includes(k))));
    if (stryMutAct_9fa48("61") ? false : stryMutAct_9fa48("60") ? true : stryMutAct_9fa48("59") ? hasRequired : (stryCov_9fa48("59", "60", "61"), !hasRequired)) {
      if (stryMutAct_9fa48("62")) {
        {}
      } else {
        stryCov_9fa48("62");
        errors.push(stryMutAct_9fa48("63") ? `` : (stryCov_9fa48("63"), `csv header must include: ${required.join(stryMutAct_9fa48("64") ? "" : (stryCov_9fa48("64"), ','))}`));
        return stryMutAct_9fa48("65") ? {} : (stryCov_9fa48("65"), {
          rows: result,
          errors
        });
      }
    }
    const idx = {};
    header.forEach(stryMutAct_9fa48("66") ? () => undefined : (stryCov_9fa48("66"), (h, i) => idx[h] = i));
    for (let i = 1; stryMutAct_9fa48("69") ? i >= lines.length : stryMutAct_9fa48("68") ? i <= lines.length : stryMutAct_9fa48("67") ? false : (stryCov_9fa48("67", "68", "69"), i < lines.length); stryMutAct_9fa48("70") ? i-- : (stryCov_9fa48("70"), i++)) {
      if (stryMutAct_9fa48("71")) {
        {}
      } else {
        stryCov_9fa48("71");
        const line = lines[i];
        const cols = line.split(stryMutAct_9fa48("72") ? "" : (stryCov_9fa48("72"), ',')).map(stryMutAct_9fa48("73") ? () => undefined : (stryCov_9fa48("73"), c => stryMutAct_9fa48("74") ? c : (stryCov_9fa48("74"), c.trim())));
        const obj = {};
        for (const k of header) {
          if (stryMutAct_9fa48("75")) {
            {}
          } else {
            stryCov_9fa48("75");
            obj[k] = (stryMutAct_9fa48("78") ? cols[idx[k]] === undefined : stryMutAct_9fa48("77") ? false : stryMutAct_9fa48("76") ? true : (stryCov_9fa48("76", "77", "78"), cols[idx[k]] !== undefined)) ? cols[idx[k]] : stryMutAct_9fa48("79") ? "Stryker was here!" : (stryCov_9fa48("79"), '');
          }
        }
        // basic validation
        if (stryMutAct_9fa48("82") ? !obj.studentId && !obj.courseId : stryMutAct_9fa48("81") ? false : stryMutAct_9fa48("80") ? true : (stryCov_9fa48("80", "81", "82"), (stryMutAct_9fa48("83") ? obj.studentId : (stryCov_9fa48("83"), !obj.studentId)) || (stryMutAct_9fa48("84") ? obj.courseId : (stryCov_9fa48("84"), !obj.courseId)))) {
          if (stryMutAct_9fa48("85")) {
            {}
          } else {
            stryCov_9fa48("85");
            errors.push(stryMutAct_9fa48("86") ? `` : (stryCov_9fa48("86"), `line ${stryMutAct_9fa48("87") ? i - 1 : (stryCov_9fa48("87"), i + 1)}: missing studentId or courseId`));
            continue;
          }
        }
        if (stryMutAct_9fa48("90") ? false : stryMutAct_9fa48("89") ? true : stryMutAct_9fa48("88") ? isValidDateISO(obj.date) : (stryCov_9fa48("88", "89", "90"), !isValidDateISO(obj.date))) {
          if (stryMutAct_9fa48("91")) {
            {}
          } else {
            stryCov_9fa48("91");
            errors.push(stryMutAct_9fa48("92") ? `` : (stryCov_9fa48("92"), `line ${stryMutAct_9fa48("93") ? i - 1 : (stryCov_9fa48("93"), i + 1)}: invalid date ${obj.date}`));
            continue;
          }
        }
        const status = stryMutAct_9fa48("94") ? (obj.status || '').toUpperCase() : (stryCov_9fa48("94"), (stryMutAct_9fa48("97") ? obj.status && '' : stryMutAct_9fa48("96") ? false : stryMutAct_9fa48("95") ? true : (stryCov_9fa48("95", "96", "97"), obj.status || (stryMutAct_9fa48("98") ? "Stryker was here!" : (stryCov_9fa48("98"), '')))).toLowerCase());
        if (stryMutAct_9fa48("101") ? false : stryMutAct_9fa48("100") ? true : stryMutAct_9fa48("99") ? ['present', 'absent'].includes(status) : (stryCov_9fa48("99", "100", "101"), !(stryMutAct_9fa48("102") ? [] : (stryCov_9fa48("102"), [stryMutAct_9fa48("103") ? "" : (stryCov_9fa48("103"), 'present'), stryMutAct_9fa48("104") ? "" : (stryCov_9fa48("104"), 'absent')])).includes(status))) {
          if (stryMutAct_9fa48("105")) {
            {}
          } else {
            stryCov_9fa48("105");
            errors.push(stryMutAct_9fa48("106") ? `` : (stryCov_9fa48("106"), `line ${stryMutAct_9fa48("107") ? i - 1 : (stryCov_9fa48("107"), i + 1)}: invalid status ${obj.status}`));
            continue;
          }
        }
        obj.status = status;
        result.push(obj);
      }
    }
    return stryMutAct_9fa48("108") ? {} : (stryCov_9fa48("108"), {
      rows: result,
      errors
    });
  }
}
function calculateAttendancePercentage(presentCount, totalCount) {
  if (stryMutAct_9fa48("109")) {
    {}
  } else {
    stryCov_9fa48("109");
    if (stryMutAct_9fa48("112") ? totalCount !== 0 : stryMutAct_9fa48("111") ? false : stryMutAct_9fa48("110") ? true : (stryCov_9fa48("110", "111", "112"), totalCount === 0)) return 0;
    return (stryMutAct_9fa48("115") ? totalCount !== 0 : stryMutAct_9fa48("114") ? false : stryMutAct_9fa48("113") ? true : (stryCov_9fa48("113", "114", "115"), totalCount === 0)) ? 0 : stryMutAct_9fa48("116") ? Math.round(presentCount / totalCount * 100 * 100) * 100 : (stryCov_9fa48("116"), Math.round(stryMutAct_9fa48("117") ? presentCount / totalCount * 100 / 100 : (stryCov_9fa48("117"), (stryMutAct_9fa48("118") ? presentCount / totalCount / 100 : (stryCov_9fa48("118"), (stryMutAct_9fa48("119") ? presentCount * totalCount : (stryCov_9fa48("119"), presentCount / totalCount)) * 100)) * 100)) / 100);
  }
}
module.exports = stryMutAct_9fa48("120") ? {} : (stryCov_9fa48("120"), {
  rowToAttendance,
  isValidDateISO,
  parseCsv,
  calculateAttendancePercentage
});