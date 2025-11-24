// @ts-nocheck
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const DB_PATH = path.join(__dirname, "data", "students.db");

// Ensure data folder exists
if (!fs.existsSync(path.join(__dirname, "data"))) {
    fs.mkdirSync(path.join(__dirname, "data"));
}

const db = new sqlite3.Database(DB_PATH);

function run(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function all(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, function (err, rows) {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function seed() {
    console.log("\n🌱 Seeding database...\n");

    // Create tables
    await run(`CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        admissionNo TEXT,
        firstName TEXT,
        lastName TEXT,
        dob TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        year TEXT,
        notes TEXT,
        createdAt INTEGER,
        updatedAt INTEGER
    )`);

    await run(`CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        code TEXT,
        name TEXT,
        instructor TEXT
    )`);

    await run(`CREATE TABLE IF NOT EXISTS enrollments (
        id TEXT PRIMARY KEY,
        studentId TEXT,
        courseId TEXT,
        enrolledAt INTEGER
    )`);

    await run(`CREATE TABLE IF NOT EXISTS attendance (
        id TEXT PRIMARY KEY,
        studentId TEXT,
        courseId TEXT,
        date TEXT,
        status TEXT
    )`);

    // Clear tables
    await run("DELETE FROM students");
    await run("DELETE FROM courses");
    await run("DELETE FROM enrollments");
    await run("DELETE FROM attendance");

    console.log("✔ Old data cleared.");

    // 20 students
    const studentNames = [
        ["Aarav", "Shah"], ["Asha", "Patel"], ["Ravi", "Kumar"], ["Maya", "Singh"], ["Karan", "Mehta"],
        ["Neha", "Verma"], ["Sahil", "Rao"], ["Pooja", "Joshi"], ["Vikram", "Desai"], ["Isha", "Kapoor"],
        ["Rohit", "Gupta"], ["Ananya", "Bose"], ["Deepak", "Khan"], ["Sana", "Ali"], ["Arjun", "Nair"],
        ["Priya", "Sharma"], ["Manav", "Iyer"], ["Divya", "Menon"], ["Kavya", "Reddy"], ["Sameer", "Chopra"]
    ];

    let students = [];

    for (let i = 0; i < 20; i++) {
        const [fn, ln] = studentNames[i];
        const id = uuid();
        const admissionNo = `ADM${100 + i}`;
        const created = Date.now();
        students.push({
            id,
            admissionNo,
            firstName: fn,
            lastName: ln,
            dob: "2005-01-15",
            email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
            phone: "9876543210",
            address: "Mumbai",
            year: "2025",
            notes: "",
            createdAt: created,
            updatedAt: created
        });

        await run(
            `INSERT INTO students VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            Object.values(students[i])
        );
    }

    console.log("✔ 20 students added.");

    // 5 courses
    const courses = [
        { code: "CS101", name: "Intro to Programming", instructor: "Dr. Rao" },
        { code: "MA101", name: "Mathematics I", instructor: "Dr. Sharma" },
        { code: "PH101", name: "Physics I", instructor: "Dr. Iyer" },
        { code: "EN101", name: "English Communication", instructor: "Prof. Menon" },
        { code: "CS102", name: "Data Structures", instructor: "Dr. Gupta" }
    ];

    let courseRows = [];

    for (let c of courses) {
        const id = uuid();
        courseRows.push({ id, ...c });
        await run(
            `INSERT INTO courses VALUES (?, ?, ?, ?)`,
            [id, c.code, c.name, c.instructor]
        );
    }

    console.log("✔ 5 courses added.");

    // Enroll each student in 2 courses
    for (let s of students) {
        const chosen = courseRows.slice(0, 2); // always first 2 courses
        for (let c of chosen) {
            await run(
                `INSERT INTO enrollments VALUES (?, ?, ?, ?)`,
                [uuid(), s.id, c.id, Date.now()]
            );
        }
    }

    console.log("✔ Enrollments added.");

    // Attendance for 1 month (Oct 2025)
    const dates = [];
    let start = new Date(2025, 9, 1); // Oct 1
    let end = new Date(2025, 9, 31);

    while (start <= end) {
        if (start.getDay() !== 0 && start.getDay() !== 6) {
            dates.push(start.toISOString().slice(0, 10));
        }
        start.setDate(start.getDate() + 1);
    }

    for (let s of students) {
        for (let c of courseRows.slice(0, 2)) {
            for (let date of dates) {
                let status = Math.random() < 0.85 ? "present" : "absent";
                await run(
                    `INSERT INTO attendance VALUES (?, ?, ?, ?, ?)`,
                    [uuid(), s.id, c.id, date, status]
                );
            }
        }
    }

    console.log("✔ Attendance added for one full month.");

    console.log("\n🎉 Seeding complete!\n");
    db.close();
}

seed().catch(err => console.error(err));
