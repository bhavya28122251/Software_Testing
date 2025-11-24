const request = require('supertest');
const { expect } = require('chai');
const path = require('path');
const fs = require('fs');

// Set test DB path BEFORE requiring server/db  
const TEST_DB_PATH = path.join(__dirname, '..', '..', 'test_integration.db');
process.env.DB_PATH = TEST_DB_PATH;

// Remove existing test DB if any
if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
}

const app = require('../../server');
const db = require('../../db');

describe('Integration Tests: Routes', function () {
    this.timeout(10000);

    let studentId;
    let courseId;
    let enrollmentId;

    before(async function () {
        await db.waitForReady();
    });

    after(function () {
        if (fs.existsSync(TEST_DB_PATH)) {
            fs.unlinkSync(TEST_DB_PATH);
        }
    });

    describe('Student Routes', function () {
        it('POST /api/students - create student', async function () {
            const res = await request(app)
                .post('/api/students')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    dob: '2000-01-01'
                });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('id');
            studentId = res.body.id;
        });

        it('GET /api/students - list students', async function () {
            const res = await request(app).get('/api/students');
            expect(res.status).to.equal(200);
            expect(res.body.data).to.be.an('array');
            expect(res.body.data.length).to.be.greaterThan(0);
        });

        it('GET /api/students/:id - get student by ID', async function () {
            const res = await request(app).get(`/api/students/${studentId}`);
            expect(res.status).to.equal(200);
            expect(res.body.id).to.equal(studentId);
        });

        it('PUT /api/students/:id - update student', async function () {
            const res = await request(app)
                .put(`/api/students/${studentId}`)
                .send({ firstName: 'Johnny', lastName: 'Doe' });
            expect(res.status).to.equal(200);
            expect(res.body.firstName).to.equal('Johnny');
        });
    });

    describe('Course Routes', function () {
        it('POST /api/courses - create course', async function () {
            const res = await request(app)
                .post('/api/courses')
                .send({
                    code: 'CS101',
                    name: 'Intro to CS',
                    credits: 3
                });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('id');
            courseId = res.body.id;
        });

        it('GET /api/courses - list courses', async function () {
            const res = await request(app).get('/api/courses');
            expect(res.status).to.equal(200);
            expect(res.body.data).to.be.an('array');
            expect(res.body.data.length).to.be.greaterThan(0);
        });
    });

    describe('Enrollment Routes', function () {
        it('POST /api/enroll - enroll student', async function () {
            const res = await request(app)
                .post('/api/enroll')
                .send({ studentId, courseId });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('id');
            enrollmentId = res.body.id;
        });

        it('POST /api/enroll - prevent duplicate', async function () {
            const res = await request(app)
                .post('/api/enroll')
                .send({ studentId, courseId });

            expect(res.status).to.equal(409);
        });

        it('GET /api/enroll - list enrollments', async function () {
            const res = await request(app).get('/api/enroll');
            expect(res.status).to.equal(200);
            expect(res.body.data).to.be.an('array');
        });

        it('GET /api/enroll/stats - get stats', async function () {
            const res = await request(app).get('/api/enroll/stats');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('perStudent');
            expect(res.body).to.have.property('perCourse');
        });
    });

    describe('Attendance Routes', function () {
        it('POST /api/attendance - mark attendance', async function () {
            const res = await request(app)
                .post('/api/attendance')
                .send({
                    studentId,
                    courseId,
                    date: '2023-10-01',
                    status: 'present'
                });

            expect(res.status).to.equal(200);
            expect(res.body.ok).to.be.true;
        });

        it('GET /api/attendance - list attendance', async function () {
            const res = await request(app).get('/api/attendance');
            expect(res.status).to.equal(200);
            expect(res.body.data).to.be.an('array');
        });


    });
});
