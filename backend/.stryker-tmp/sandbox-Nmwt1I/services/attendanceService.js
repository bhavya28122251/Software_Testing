// @ts-nocheck
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
function rowToAttendance(row) {
  if (stryMutAct_9fa48("0")) {
    {}
  } else {
    stryCov_9fa48("0");
    if (stryMutAct_9fa48("3") ? false : stryMutAct_9fa48("2") ? true : (stryCov_9fa48("2", "3"), !row)) return null;
    return {
      id: (stryMutAct_9fa48("7") ? row.id !== undefined : stryMutAct_9fa48("6") ? false : stryMutAct_9fa48("5") ? true : (stryCov_9fa48("5", "6", "7"), row.id === undefined)) ? null : row.id,
      studentId: (stryMutAct_9fa48("10") ? row.studentId != null : stryMutAct_9fa48("9") ? false : stryMutAct_9fa48("8") ? true : (stryCov_9fa48("8", "9", "10"), row.studentId == null)) ? stryMutAct_9fa48("11") ? "Stryker was here!" : (stryCov_9fa48("11"), '') : String(row.studentId),
      courseId: (stryMutAct_9fa48("14") ? row.courseId != null : stryMutAct_9fa48("13") ? false : stryMutAct_9fa48("12") ? true : (stryCov_9fa48("12", "13", "14"), row.courseId == null)) ? stryMutAct_9fa48("15") ? "Stryker was here!" : (stryCov_9fa48("15"), '') : String(row.courseId),
      date: (stryMutAct_9fa48("18") ? row.date != null : stryMutAct_9fa48("17") ? false : stryMutAct_9fa48("16") ? true : (stryCov_9fa48("16", "17", "18"), row.date == null)) ? stryMutAct_9fa48("19") ? "Stryker was here!" : (stryCov_9fa48("19"), '') : String(row.date),
      status: (stryMutAct_9fa48("22") ? row.status != null : stryMutAct_9fa48("21") ? false : stryMutAct_9fa48("20") ? true : (stryCov_9fa48("20", "21", "22"), row.status == null)) ? stryMutAct_9fa48("23") ? "Stryker was here!" : (stryCov_9fa48("23"), '') : stryMutAct_9fa48("24") ? String(row.status).toUpperCase() : (stryCov_9fa48("24"), String(row.status).toLowerCase())
    };
  }
}

/**
 * Validate ISO date (YYYY-MM-DD) and ensure day actually exists (reject 2025-02-30)
 */
function isValidDateISO(s) {
  if (stryMutAct_9fa48("25")) {
    {}
  } else {
    stryCov_9fa48("25");
    if (stryMutAct_9fa48("28") ? !s && typeof s !== 'string' : stryMutAct_9fa48("27") ? false : stryMutAct_9fa48("26") ? true : (stryCov_9fa48("26", "27", "28"), !s || (stryMutAct_9fa48("31") ? typeof s === 'string' : stryMutAct_9fa48("30") ? false : (stryCov_9fa48("30", "31"), typeof s !== (stryMutAct_9fa48("32") ? "" : (stryCov_9fa48("32"), 'string')))))) return false;
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (stryMutAct_9fa48("44") ? false : stryMutAct_9fa48("43") ? true : (stryCov_9fa48("43", "44"), !m)) return false;
    const year = Number(m[1]),
      month = Number(m[2]),
      day = Number(m[3]);
    // month 1-12, day 1-31 preliminary
    if (stryMutAct_9fa48("48") ? (month < 1 || month > 12 || day < 1) && day > 31 : stryMutAct_9fa48("47") ? false : stryMutAct_9fa48("46") ? true : (stryCov_9fa48("46", "47", "48"), (stryMutAct_9fa48("50") ? (month < 1 || month > 12) && day < 1 : stryMutAct_9fa48("49") ? false : (stryCov_9fa48("49", "50"), (stryMutAct_9fa48("52") ? month < 1 && month > 12 : stryMutAct_9fa48("51") ? false : (stryCov_9fa48("51", "52"), (stryMutAct_9fa48("55") ? month >= 1 : stryMutAct_9fa48("54") ? month <= 1 : stryMutAct_9fa48("53") ? false : (stryCov_9fa48("53", "54", "55"), month < 1)) || (stryMutAct_9fa48("58") ? month <= 12 : stryMutAct_9fa48("57") ? month >= 12 : stryMutAct_9fa48("56") ? false : (stryCov_9fa48("56", "57", "58"), month > 12)))) || (stryMutAct_9fa48("61") ? day >= 1 : stryMutAct_9fa48("60") ? day <= 1 : stryMutAct_9fa48("59") ? false : (stryCov_9fa48("59", "60", "61"), day < 1)))) || (stryMutAct_9fa48("64") ? day <= 31 : stryMutAct_9fa48("63") ? day >= 31 : stryMutAct_9fa48("62") ? false : (stryCov_9fa48("62", "63", "64"), day > 31)))) return false;
    // create Date and compare components to avoid JS auto-rollover
    const d = new Date(stryMutAct_9fa48("66") ? `` : (stryCov_9fa48("66"), `${year.toString().padStart(4, stryMutAct_9fa48("67") ? "" : (stryCov_9fa48("67"), '0'))}-${String(month).padStart(2, stryMutAct_9fa48("68") ? "" : (stryCov_9fa48("68"), '0'))}-${String(day).padStart(2, stryMutAct_9fa48("69") ? "" : (stryCov_9fa48("69"), '0'))}T00:00:00Z`));
    if (stryMutAct_9fa48("71") ? false : stryMutAct_9fa48("70") ? true : (stryCov_9fa48("70", "71"), Number.isNaN(d.getTime()))) return false;
    // get UTC components
    const uy = d.getUTCFullYear(),
      um = d.getUTCMonth() + 1,
      ud = d.getUTCDate();
    return stryMutAct_9fa48("76") ? uy === year && um === month || ud === day : stryMutAct_9fa48("75") ? false : stryMutAct_9fa48("74") ? true : (stryCov_9fa48("74", "75", "76"), (stryMutAct_9fa48("78") ? uy === year || um === month : stryMutAct_9fa48("77") ? true : (stryCov_9fa48("77", "78"), (stryMutAct_9fa48("80") ? uy !== year : stryMutAct_9fa48("79") ? true : (stryCov_9fa48("79", "80"), uy === year)) && (stryMutAct_9fa48("82") ? um !== month : stryMutAct_9fa48("81") ? true : (stryCov_9fa48("81", "82"), um === month)))) && (stryMutAct_9fa48("84") ? ud !== day : stryMutAct_9fa48("83") ? true : (stryCov_9fa48("83", "84"), ud === day)));
  }
}

/**
 * dateRange inclusive of both ends: returns array of YYYY-MM-DD strings
 */
function dateRange(from, to) {
  if (stryMutAct_9fa48("85")) {
    {}
  } else {
    stryCov_9fa48("85");
    if (stryMutAct_9fa48("88") ? !isValidDateISO(from) && !isValidDateISO(to) : stryMutAct_9fa48("87") ? false : stryMutAct_9fa48("86") ? true : (stryCov_9fa48("86", "87", "88"), !isValidDateISO(from) || !isValidDateISO(to))) return stryMutAct_9fa48("91") ? ["Stryker was here"] : (stryCov_9fa48("91"), []);
    const start = new Date(from + (stryMutAct_9fa48("92") ? "" : (stryCov_9fa48("92"), 'T00:00:00Z')));
    const end = new Date(to + (stryMutAct_9fa48("93") ? "" : (stryCov_9fa48("93"), 'T00:00:00Z')));
    if (stryMutAct_9fa48("97") ? start <= end : stryMutAct_9fa48("96") ? start >= end : stryMutAct_9fa48("95") ? false : stryMutAct_9fa48("94") ? true : (stryCov_9fa48("94", "95", "96", "97"), start > end)) return stryMutAct_9fa48("98") ? ["Stryker was here"] : (stryCov_9fa48("98"), []);
    const out = stryMutAct_9fa48("99") ? ["Stryker was here"] : (stryCov_9fa48("99"), []);
    for (let d = new Date(start); stryMutAct_9fa48("102") ? d > end : stryMutAct_9fa48("101") ? d < end : stryMutAct_9fa48("100") ? false : (stryCov_9fa48("100", "101", "102"), d <= end); stryMutAct_9fa48("103") ? d.setTime(d.getUTCDate() + 1) : (stryCov_9fa48("103"), d.setUTCDate(d.getUTCDate() + 1))) {
      if (stryMutAct_9fa48("105")) {
        {}
      } else {
        stryCov_9fa48("105");
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, stryMutAct_9fa48("107") ? "" : (stryCov_9fa48("107"), '0'));
        const dd = String(d.getUTCDate()).padStart(2, stryMutAct_9fa48("108") ? "" : (stryCov_9fa48("108"), '0'));
        out.push(stryMutAct_9fa48("109") ? `` : (stryCov_9fa48("109"), `${y}-${m}-${dd}`));
      }
    }
    return out;
  }
}

/**
 * Simple CSV parser for attendance CSV with header studentId,courseId,date,status
 * Returns { rows: [ {studentId,courseId,date,status} ], errors: [string] }
 *
 * This parser is intentionally small and deterministic: it supports basic quoted fields
 * (double quotes) and comma separation. It's kept pure for easy unit/mutation testing.
 */
function parseCsv(csvText) {
  if (stryMutAct_9fa48("110")) {
    {}
  } else {
    stryCov_9fa48("110");
    const errors = stryMutAct_9fa48("111") ? ["Stryker was here"] : (stryCov_9fa48("111"), []);
    const rows = stryMutAct_9fa48("112") ? ["Stryker was here"] : (stryCov_9fa48("112"), []);
    if (stryMutAct_9fa48("115") ? !csvText && !csvText.trim() : stryMutAct_9fa48("114") ? false : stryMutAct_9fa48("113") ? true : (stryCov_9fa48("113", "114", "115"), !csvText || !(stryMutAct_9fa48("118") ? csvText : (stryCov_9fa48("118"), csvText.trim())))) {
      if (stryMutAct_9fa48("119")) {
        {}
      } else {
        stryCov_9fa48("119");
        errors.push(stryMutAct_9fa48("120") ? "" : (stryCov_9fa48("120"), 'empty csv'));
        return {
          rows: stryMutAct_9fa48("122") ? ["Stryker was here"] : (stryCov_9fa48("122"), []),
          errors
        };
      }
    }
    const lines = stryMutAct_9fa48("123") ? csvText.split(/\r?\n/).map(l => l.trim()) : (stryCov_9fa48("123"), csvText.split(/\r?\n/).map(stryMutAct_9fa48("125") ? () => undefined : (stryCov_9fa48("125"), l => stryMutAct_9fa48("126") ? l : (stryCov_9fa48("126"), l.trim()))).filter(Boolean));
    if (stryMutAct_9fa48("129") ? lines.length !== 0 : stryMutAct_9fa48("128") ? false : stryMutAct_9fa48("127") ? true : (stryCov_9fa48("127", "128", "129"), lines.length === 0)) {
      if (stryMutAct_9fa48("130")) {
        {}
      } else {
        stryCov_9fa48("130");
        errors.push(stryMutAct_9fa48("131") ? "" : (stryCov_9fa48("131"), 'empty csv'));
        return {
          rows: stryMutAct_9fa48("133") ? ["Stryker was here"] : (stryCov_9fa48("133"), []),
          errors
        };
      }
    }

    // parse header
    const headerLine = lines[0];
    const header = splitCsvLine(headerLine).map(stryMutAct_9fa48("134") ? () => undefined : (stryCov_9fa48("134"), h => stryMutAct_9fa48("135") ? h : (stryCov_9fa48("135"), h.trim())));
    const required = stryMutAct_9fa48("136") ? [] : (stryCov_9fa48("136"), [stryMutAct_9fa48("137") ? "" : (stryCov_9fa48("137"), 'studentId'), stryMutAct_9fa48("138") ? "" : (stryCov_9fa48("138"), 'courseId'), stryMutAct_9fa48("139") ? "" : (stryCov_9fa48("139"), 'date'), stryMutAct_9fa48("140") ? "" : (stryCov_9fa48("140"), 'status')]);
    const missing = stryMutAct_9fa48("141") ? required : (stryCov_9fa48("141"), required.filter(stryMutAct_9fa48("142") ? () => undefined : (stryCov_9fa48("142"), r => !header.includes(r))));
    if (stryMutAct_9fa48("145") ? false : stryMutAct_9fa48("144") ? true : (stryCov_9fa48("144", "145"), missing.length)) {
      if (stryMutAct_9fa48("146")) {
        {}
      } else {
        stryCov_9fa48("146");
        errors.push(stryMutAct_9fa48("147") ? `` : (stryCov_9fa48("147"), `csv header missing required columns: ${missing.join(stryMutAct_9fa48("148") ? "" : (stryCov_9fa48("148"), ','))}`));
        return {
          rows: stryMutAct_9fa48("150") ? ["Stryker was here"] : (stryCov_9fa48("150"), []),
          errors
        };
      }
    }

    // map header index
    const idx = {};
    header.forEach(stryMutAct_9fa48("151") ? () => undefined : (stryCov_9fa48("151"), (h, i) => idx[h] = i));

    // parse each data line
    for (let i = 1; stryMutAct_9fa48("154") ? i >= lines.length : stryMutAct_9fa48("153") ? i <= lines.length : stryMutAct_9fa48("152") ? false : (stryCov_9fa48("152", "153", "154"), i < lines.length); i++) {
      if (stryMutAct_9fa48("156")) {
        {}
      } else {
        stryCov_9fa48("156");
        const line = lines[i];
        const cols = splitCsvLine(line);
        // ensure at least required columns exist by index check
        const rStudent = cols[idx.studentId];
        const rCourse = cols[idx.courseId];
        const rDate = cols[idx.date];
        const rStatus = cols[idx.status];

        // basic presence validation
        if (stryMutAct_9fa48("159") ? (!rStudent || !rCourse || !rDate) && !rStatus : stryMutAct_9fa48("158") ? false : stryMutAct_9fa48("157") ? true : (stryCov_9fa48("157", "158", "159"), (stryMutAct_9fa48("161") ? (!rStudent || !rCourse) && !rDate : stryMutAct_9fa48("160") ? false : (stryCov_9fa48("160", "161"), (stryMutAct_9fa48("163") ? !rStudent && !rCourse : stryMutAct_9fa48("162") ? false : (stryCov_9fa48("162", "163"), !rStudent || !rCourse)) || !rDate)) || !rStatus)) {
          if (stryMutAct_9fa48("168")) {
            {}
          } else {
            stryCov_9fa48("168");
            errors.push(stryMutAct_9fa48("169") ? `` : (stryCov_9fa48("169"), `line ${i + 1}: missing required field(s)`));
            continue;
          }
        }
        const dateStr = stryMutAct_9fa48("171") ? String(rDate) : (stryCov_9fa48("171"), String(rDate).trim());
        const statusStr = stryMutAct_9fa48("173") ? String(rStatus).toLowerCase() : stryMutAct_9fa48("172") ? String(rStatus).trim().toUpperCase() : (stryCov_9fa48("172", "173"), String(rStatus).trim().toLowerCase());
        if (stryMutAct_9fa48("176") ? false : stryMutAct_9fa48("175") ? true : (stryCov_9fa48("175", "176"), !isValidDateISO(dateStr))) {
          if (stryMutAct_9fa48("177")) {
            {}
          } else {
            stryCov_9fa48("177");
            errors.push(stryMutAct_9fa48("178") ? `` : (stryCov_9fa48("178"), `line ${i + 1}: invalid date '${dateStr}'`));
            continue;
          }
        }

        // status: accept present/absent (tests tolerate unknown, but prefer validation)
        const allowed = stryMutAct_9fa48("180") ? [] : (stryCov_9fa48("180"), [stryMutAct_9fa48("181") ? "" : (stryCov_9fa48("181"), 'present'), stryMutAct_9fa48("182") ? "" : (stryCov_9fa48("182"), 'absent')]);
        const normStatus = stryMutAct_9fa48("183") ? statusStr.toUpperCase() : (stryCov_9fa48("183"), statusStr.toLowerCase());
        if (stryMutAct_9fa48("186") ? false : stryMutAct_9fa48("185") ? true : (stryCov_9fa48("185", "186"), !allowed.includes(normStatus))) {
          if (stryMutAct_9fa48("187")) {
            {}
          } else {
            stryCov_9fa48("187");
            // don't hard-fail — tests accept either error or unknown returned; we choose to error
            errors.push(stryMutAct_9fa48("188") ? `` : (stryCov_9fa48("188"), `line ${i + 1}: invalid status '${statusStr}'`));
            continue;
          }
        }
        rows.push({
          studentId: stryMutAct_9fa48("191") ? String(rStudent) : (stryCov_9fa48("191"), String(rStudent).trim()),
          courseId: stryMutAct_9fa48("192") ? String(rCourse) : (stryCov_9fa48("192"), String(rCourse).trim()),
          date: dateStr,
          status: normStatus
        });
      }
    }
    return {
      rows,
      errors
    };
  }
}

/**
 * Splits a single CSV line supporting double-quoted fields (basic)
 * Returns array of field strings (quotes removed).
 */
function splitCsvLine(line) {
  if (stryMutAct_9fa48("194")) {
    {}
  } else {
    stryCov_9fa48("194");
    const res = stryMutAct_9fa48("195") ? ["Stryker was here"] : (stryCov_9fa48("195"), []);
    let cur = stryMutAct_9fa48("196") ? "Stryker was here!" : (stryCov_9fa48("196"), '');
    let inQuotes = false;
    for (let i = 0; stryMutAct_9fa48("200") ? i >= line.length : stryMutAct_9fa48("199") ? i <= line.length : stryMutAct_9fa48("198") ? false : (stryCov_9fa48("198", "199", "200"), i < line.length); i++) {
      if (stryMutAct_9fa48("202")) {
        {}
      } else {
        stryCov_9fa48("202");
        const ch = line[i];
        if (stryMutAct_9fa48("205") ? ch !== '"' : stryMutAct_9fa48("204") ? false : stryMutAct_9fa48("203") ? true : (stryCov_9fa48("203", "204", "205"), ch === (stryMutAct_9fa48("206") ? "" : (stryCov_9fa48("206"), '"')))) {
          if (stryMutAct_9fa48("207")) {
            {}
          } else {
            stryCov_9fa48("207");
            // handle double double-quotes inside quotes -> produce a single quote char
            if (stryMutAct_9fa48("210") ? inQuotes && i + 1 < line.length || line[i + 1] === '"' : stryMutAct_9fa48("209") ? false : stryMutAct_9fa48("208") ? true : (stryCov_9fa48("208", "209", "210"), (stryMutAct_9fa48("212") ? inQuotes || i + 1 < line.length : stryMutAct_9fa48("211") ? true : (stryCov_9fa48("211", "212"), inQuotes && (stryMutAct_9fa48("215") ? i + 1 >= line.length : stryMutAct_9fa48("214") ? i + 1 <= line.length : stryMutAct_9fa48("213") ? true : (stryCov_9fa48("213", "214", "215"), i + 1 < line.length)))) && (stryMutAct_9fa48("218") ? line[i + 1] !== '"' : stryMutAct_9fa48("217") ? true : (stryCov_9fa48("217", "218"), line[i + 1] === (stryMutAct_9fa48("220") ? "" : (stryCov_9fa48("220"), '"')))))) {
              if (stryMutAct_9fa48("221")) {
                {}
              } else {
                stryCov_9fa48("221");
                cur += stryMutAct_9fa48("222") ? "" : (stryCov_9fa48("222"), '"');
                i++;
              }
            } else {
              if (stryMutAct_9fa48("224")) {
                {}
              } else {
                stryCov_9fa48("224");
                inQuotes = !inQuotes;
              }
            }
          }
        } else if (stryMutAct_9fa48("228") ? ch === ',' || !inQuotes : stryMutAct_9fa48("227") ? false : stryMutAct_9fa48("226") ? true : (stryCov_9fa48("226", "227", "228"), (stryMutAct_9fa48("230") ? ch !== ',' : stryMutAct_9fa48("229") ? true : (stryCov_9fa48("229", "230"), ch === (stryMutAct_9fa48("231") ? "" : (stryCov_9fa48("231"), ',')))) && !inQuotes)) {
          if (stryMutAct_9fa48("233")) {
            {}
          } else {
            stryCov_9fa48("233");
            res.push(cur);
            cur = stryMutAct_9fa48("234") ? "Stryker was here!" : (stryCov_9fa48("234"), '');
          }
        } else {
          if (stryMutAct_9fa48("235")) {
            {}
          } else {
            stryCov_9fa48("235");
            stryMutAct_9fa48("236") ? cur -= ch : (stryCov_9fa48("236"), cur += ch);
          }
        }
      }
    }
    res.push(cur);
    return res;
  }
}

/**
 * calculate attendance percentage (rounded to integer)
 */
function calculateAttendancePercentage(presentCount, totalCount) {
  if (stryMutAct_9fa48("237")) {
    {}
  } else {
    stryCov_9fa48("237");
    if (stryMutAct_9fa48("240") ? !totalCount && totalCount === 0 : stryMutAct_9fa48("239") ? false : stryMutAct_9fa48("238") ? true : (stryCov_9fa48("238", "239", "240"), !totalCount || (stryMutAct_9fa48("243") ? totalCount !== 0 : stryMutAct_9fa48("242") ? false : (stryCov_9fa48("242", "243"), totalCount === 0)))) return 0;
    return Math.round(presentCount / totalCount * 100);
  }
}

/**
 * markStatus manipulates in-memory rows array:
 * - if no existing row for student+course+date -> insert
 * - if existing and force=false -> skip
 * - if existing and force=true -> update status
 *
 * Returns { inserted: 0|1, updated: 0|1, skipped: 0|1, row: updatedOrInsertedRow }
 */
function markStatus(rows, studentId, courseId, date, status = stryMutAct_9fa48("246") ? "" : (stryCov_9fa48("246"), 'present'), force = false) {
  if (stryMutAct_9fa48("248")) {
    {}
  } else {
    stryCov_9fa48("248");
    if (stryMutAct_9fa48("251") ? (!studentId || !courseId) && !date : stryMutAct_9fa48("250") ? false : stryMutAct_9fa48("249") ? true : (stryCov_9fa48("249", "250", "251"), (stryMutAct_9fa48("253") ? !studentId && !courseId : stryMutAct_9fa48("252") ? false : (stryCov_9fa48("252", "253"), !studentId || !courseId)) || !date)) throw new Error(stryMutAct_9fa48("257") ? "" : (stryCov_9fa48("257"), 'studentId, courseId and date required'));
    if (stryMutAct_9fa48("260") ? false : stryMutAct_9fa48("259") ? true : (stryCov_9fa48("259", "260"), !isValidDateISO(date))) throw new Error(stryMutAct_9fa48("261") ? "" : (stryCov_9fa48("261"), 'invalid date'));
    const normStatus = stryMutAct_9fa48("262") ? String(status).toUpperCase() : (stryCov_9fa48("262"), String(status).toLowerCase());
    const allowed = stryMutAct_9fa48("263") ? [] : (stryCov_9fa48("263"), [stryMutAct_9fa48("264") ? "" : (stryCov_9fa48("264"), 'present'), stryMutAct_9fa48("265") ? "" : (stryCov_9fa48("265"), 'absent')]);
    if (stryMutAct_9fa48("268") ? false : stryMutAct_9fa48("267") ? true : (stryCov_9fa48("267", "268"), !allowed.includes(normStatus))) throw new Error(stryMutAct_9fa48("269") ? "" : (stryCov_9fa48("269"), 'invalid status'));

    // find existing
    const existingIndex = rows.findIndex(stryMutAct_9fa48("270") ? () => undefined : (stryCov_9fa48("270"), r => stryMutAct_9fa48("273") ? r.studentId === studentId && r.courseId === courseId || r.date === date : stryMutAct_9fa48("272") ? false : stryMutAct_9fa48("271") ? true : (stryCov_9fa48("271", "272", "273"), (stryMutAct_9fa48("275") ? r.studentId === studentId || r.courseId === courseId : stryMutAct_9fa48("274") ? true : (stryCov_9fa48("274", "275"), (stryMutAct_9fa48("277") ? r.studentId !== studentId : stryMutAct_9fa48("276") ? true : (stryCov_9fa48("276", "277"), r.studentId === studentId)) && (stryMutAct_9fa48("279") ? r.courseId !== courseId : stryMutAct_9fa48("278") ? true : (stryCov_9fa48("278", "279"), r.courseId === courseId)))) && (stryMutAct_9fa48("281") ? r.date !== date : stryMutAct_9fa48("280") ? true : (stryCov_9fa48("280", "281"), r.date === date)))));
    if (stryMutAct_9fa48("284") ? existingIndex !== -1 : stryMutAct_9fa48("283") ? false : stryMutAct_9fa48("282") ? true : (stryCov_9fa48("282", "283", "284"), existingIndex === -1)) {
      if (stryMutAct_9fa48("286")) {
        {}
      } else {
        stryCov_9fa48("286");
        const newRow = {
          studentId,
          courseId,
          date,
          status: normStatus
        };
        rows.push(newRow);
        return {
          inserted: 1,
          updated: 0,
          skipped: 0,
          row: newRow
        };
      }
    } else {
      if (stryMutAct_9fa48("289")) {
        {}
      } else {
        stryCov_9fa48("289");
        const existing = rows[existingIndex];
        if (stryMutAct_9fa48("291") ? false : stryMutAct_9fa48("290") ? true : (stryCov_9fa48("290", "291"), force)) {
          if (stryMutAct_9fa48("292")) {
            {}
          } else {
            stryCov_9fa48("292");
            existing.status = normStatus;
            return {
              inserted: 0,
              updated: 1,
              skipped: 0,
              row: existing
            };
          }
        } else {
          if (stryMutAct_9fa48("294")) {
            {}
          } else {
            stryCov_9fa48("294");
            return {
              inserted: 0,
              updated: 0,
              skipped: 1,
              row: existing
            };
          }
        }
      }
    }
  }
}

/**
 * summarizeStudent(rows, studentId) -> { studentId, total, present, absent, percentage }
 */
function summarizeStudent(rows, studentId) {
  if (stryMutAct_9fa48("296")) {
    {}
  } else {
    stryCov_9fa48("296");
    const filtered = stryMutAct_9fa48("297") ? rows : (stryCov_9fa48("297"), rows.filter(stryMutAct_9fa48("298") ? () => undefined : (stryCov_9fa48("298"), r => stryMutAct_9fa48("301") ? r.studentId !== studentId : stryMutAct_9fa48("300") ? false : stryMutAct_9fa48("299") ? true : (stryCov_9fa48("299", "300", "301"), r.studentId === studentId))));
    const total = filtered.length;
    const present = stryMutAct_9fa48("302") ? filtered.length : (stryCov_9fa48("302"), filtered.filter(stryMutAct_9fa48("303") ? () => undefined : (stryCov_9fa48("303"), r => stryMutAct_9fa48("306") ? String(r.status).toLowerCase() !== 'present' : stryMutAct_9fa48("305") ? false : stryMutAct_9fa48("304") ? true : (stryCov_9fa48("304", "305", "306"), (stryMutAct_9fa48("307") ? String(r.status).toUpperCase() : (stryCov_9fa48("307"), String(r.status).toLowerCase())) === (stryMutAct_9fa48("308") ? "" : (stryCov_9fa48("308"), 'present'))))).length);
    const absent = total - present;
    const percentage = calculateAttendancePercentage(present, total);
    return {
      studentId,
      total,
      present,
      absent,
      percentage
    };
  }
}

/**
 * summarizeCourse(rows, courseId) -> { courseId, total, present, absent, percentage }
 */
function summarizeCourse(rows, courseId) {
  if (stryMutAct_9fa48("311")) {
    {}
  } else {
    stryCov_9fa48("311");
    const filtered = stryMutAct_9fa48("312") ? rows : (stryCov_9fa48("312"), rows.filter(stryMutAct_9fa48("313") ? () => undefined : (stryCov_9fa48("313"), r => stryMutAct_9fa48("316") ? r.courseId !== courseId : stryMutAct_9fa48("315") ? false : stryMutAct_9fa48("314") ? true : (stryCov_9fa48("314", "315", "316"), r.courseId === courseId))));
    const total = filtered.length;
    const present = stryMutAct_9fa48("317") ? filtered.length : (stryCov_9fa48("317"), filtered.filter(stryMutAct_9fa48("318") ? () => undefined : (stryCov_9fa48("318"), r => stryMutAct_9fa48("321") ? String(r.status).toLowerCase() !== 'present' : stryMutAct_9fa48("320") ? false : stryMutAct_9fa48("319") ? true : (stryCov_9fa48("319", "320", "321"), (stryMutAct_9fa48("322") ? String(r.status).toUpperCase() : (stryCov_9fa48("322"), String(r.status).toLowerCase())) === (stryMutAct_9fa48("323") ? "" : (stryCov_9fa48("323"), 'present'))))).length);
    const absent = total - present;
    const percentage = calculateAttendancePercentage(present, total);
    return {
      courseId,
      total,
      present,
      absent,
      percentage
    };
  }
}

/**
 * findMissingDates(rows, studentId, datesArray) -> returns dates from datesArray with no entry for studentId
 */
function findMissingDates(rows, studentId, datesArray = stryMutAct_9fa48("326") ? ["Stryker was here"] : (stryCov_9fa48("326"), [])) {
  if (stryMutAct_9fa48("327")) {
    {}
  } else {
    stryCov_9fa48("327");
    const presentDates = new Set(stryMutAct_9fa48("328") ? rows.map(r => r.date) : (stryCov_9fa48("328"), rows.filter(stryMutAct_9fa48("329") ? () => undefined : (stryCov_9fa48("329"), r => stryMutAct_9fa48("332") ? r.studentId !== studentId : stryMutAct_9fa48("331") ? false : stryMutAct_9fa48("330") ? true : (stryCov_9fa48("330", "331", "332"), r.studentId === studentId))).map(stryMutAct_9fa48("333") ? () => undefined : (stryCov_9fa48("333"), r => r.date))));
    return stryMutAct_9fa48("334") ? datesArray : (stryCov_9fa48("334"), datesArray.filter(stryMutAct_9fa48("335") ? () => undefined : (stryCov_9fa48("335"), d => !presentDates.has(d))));
  }
}

/**
 * consecutiveAbsences(rows, studentId) -> longest consecutive absent-streak for that student
 * rows can be unsorted; we order by date ascending and then compute streak.
 */
function consecutiveAbsences(rows, studentId) {
  if (stryMutAct_9fa48("337")) {
    {}
  } else {
    stryCov_9fa48("337");
    const studentRows = stryMutAct_9fa48("338") ? rows : (stryCov_9fa48("338"), rows.filter(stryMutAct_9fa48("339") ? () => undefined : (stryCov_9fa48("339"), r => stryMutAct_9fa48("342") ? r.studentId === studentId || isValidDateISO(r.date) : stryMutAct_9fa48("341") ? false : stryMutAct_9fa48("340") ? true : (stryCov_9fa48("340", "341", "342"), (stryMutAct_9fa48("344") ? r.studentId !== studentId : stryMutAct_9fa48("343") ? true : (stryCov_9fa48("343", "344"), r.studentId === studentId)) && isValidDateISO(r.date)))));
    // sort by date ASC
    stryMutAct_9fa48("345") ? studentRows : (stryCov_9fa48("345"), studentRows.sort(stryMutAct_9fa48("346") ? () => undefined : (stryCov_9fa48("346"), (a, b) => a.date.localeCompare(b.date))));
    let maxStreak = 0,
      curStreak = 0,
      prevDate = null;
    for (const r of studentRows) {
      if (stryMutAct_9fa48("347")) {
        {}
      } else {
        stryCov_9fa48("347");
        const status = stryMutAct_9fa48("348") ? String(r.status).toUpperCase() : (stryCov_9fa48("348"), String(r.status).toLowerCase());
        if (stryMutAct_9fa48("351") ? status !== 'absent' : stryMutAct_9fa48("350") ? false : stryMutAct_9fa48("349") ? true : (stryCov_9fa48("349", "350", "351"), status === (stryMutAct_9fa48("352") ? "" : (stryCov_9fa48("352"), 'absent')))) {
          if (stryMutAct_9fa48("353")) {
            {}
          } else {
            stryCov_9fa48("353");
            if (stryMutAct_9fa48("356") ? prevDate !== null : stryMutAct_9fa48("355") ? false : stryMutAct_9fa48("354") ? true : (stryCov_9fa48("354", "355", "356"), prevDate === null)) {
              if (stryMutAct_9fa48("357")) {
                {}
              } else {
                stryCov_9fa48("357");
                curStreak = 1;
              }
            } else {
              if (stryMutAct_9fa48("358")) {
                {}
              } else {
                stryCov_9fa48("358");
                // check if date is consecutive (prevDate + 1 day)
                const nextExpected = dateRange(prevDate, prevDate)[0]; // single day - but easier to compute next date:
                // compute next day of prevDate
                const pd = new Date(prevDate + (stryMutAct_9fa48("359") ? "" : (stryCov_9fa48("359"), 'T00:00:00Z')));
                stryMutAct_9fa48("360") ? pd.setTime(pd.getUTCDate() + 1) : (stryCov_9fa48("360"), pd.setUTCDate(pd.getUTCDate() + 1));
                const y = pd.getUTCFullYear();
                const m = String(pd.getUTCMonth() + 1).padStart(2, stryMutAct_9fa48("363") ? "" : (stryCov_9fa48("363"), '0'));
                const d = String(pd.getUTCDate()).padStart(2, stryMutAct_9fa48("364") ? "" : (stryCov_9fa48("364"), '0'));
                const nextStr = stryMutAct_9fa48("365") ? `` : (stryCov_9fa48("365"), `${y}-${m}-${d}`);
                if (stryMutAct_9fa48("368") ? r.date !== nextStr : stryMutAct_9fa48("367") ? false : stryMutAct_9fa48("366") ? true : (stryCov_9fa48("366", "367", "368"), r.date === nextStr)) {
                  if (stryMutAct_9fa48("369")) {
                    {}
                  } else {
                    stryCov_9fa48("369");
                    stryMutAct_9fa48("370") ? curStreak -= 1 : (stryCov_9fa48("370"), curStreak += 1);
                  }
                } else {
                  if (stryMutAct_9fa48("371")) {
                    {}
                  } else {
                    stryCov_9fa48("371");
                    curStreak = 1;
                  }
                }
              }
            }
            if (stryMutAct_9fa48("375") ? curStreak <= maxStreak : stryMutAct_9fa48("374") ? curStreak >= maxStreak : stryMutAct_9fa48("373") ? false : stryMutAct_9fa48("372") ? true : (stryCov_9fa48("372", "373", "374", "375"), curStreak > maxStreak)) maxStreak = curStreak;
          }
        } else {
          if (stryMutAct_9fa48("376")) {
            {}
          } else {
            stryCov_9fa48("376");
            curStreak = 0;
          }
        }
        prevDate = r.date;
      }
    }
    return maxStreak;
  }
}

/**
 * attendanceHeatmap(rows, courseId?) -> { date: { present: n, absent: m }, ... }
 */
function attendanceHeatmap(rows, courseId) {
  if (stryMutAct_9fa48("377")) {
    {}
  } else {
    stryCov_9fa48("377");
    const map = {};
    for (const r of rows) {
      if (stryMutAct_9fa48("378")) {
        {}
      } else {
        stryCov_9fa48("378");
        if (stryMutAct_9fa48("381") ? courseId || String(r.courseId) !== String(courseId) : stryMutAct_9fa48("380") ? false : stryMutAct_9fa48("379") ? true : (stryCov_9fa48("379", "380", "381"), courseId && (stryMutAct_9fa48("383") ? String(r.courseId) === String(courseId) : stryMutAct_9fa48("382") ? true : (stryCov_9fa48("382", "383"), String(r.courseId) !== String(courseId))))) continue;
        const d = r.date;
        if (stryMutAct_9fa48("386") ? false : stryMutAct_9fa48("385") ? true : (stryCov_9fa48("385", "386"), !map[d])) map[d] = {
          present: 0,
          absent: 0
        };
        const status = stryMutAct_9fa48("388") ? String(r.status).toUpperCase() : (stryCov_9fa48("388"), String(r.status).toLowerCase());
        if (stryMutAct_9fa48("391") ? status !== 'present' : stryMutAct_9fa48("390") ? false : stryMutAct_9fa48("389") ? true : (stryCov_9fa48("389", "390", "391"), status === (stryMutAct_9fa48("392") ? "" : (stryCov_9fa48("392"), 'present')))) map[d].present++;else if (stryMutAct_9fa48("396") ? status !== 'absent' : stryMutAct_9fa48("395") ? false : stryMutAct_9fa48("394") ? true : (stryCov_9fa48("394", "395", "396"), status === (stryMutAct_9fa48("397") ? "" : (stryCov_9fa48("397"), 'absent')))) map[d].absent++;
      }
    }
    return map;
  }
}

// Export functions
module.exports = {
  rowToAttendance,
  isValidDateISO,
  dateRange,
  parseCsv,
  splitCsvLine,
  calculateAttendancePercentage,
  markStatus,
  summarizeStudent,
  summarizeCourse,
  findMissingDates,
  consecutiveAbsences,
  attendanceHeatmap
};