const request = require('supertest');
const app = require('../server');
const { expect } = require('chai');

describe('API Checks', () => {
    let studentId, courseId;

    before(() => {
        studentId = 'S-' + Date.now();
        courseId = 'C-' + Date.now();
        console.log('Initialized IDs:', { studentId, courseId });
    });

    describe('Enrollment API', () => {
        it('POST /api/enroll should enroll a student', async () => {
            console.log('TEST: POST /api/enroll should enroll a student');
            console.log('Sending enrollment:', { studentId, courseId });
            const res = await request(app)
                .post('/api/enroll')
                .send({ studentId, courseId });

            if (res.status !== 201) {
                console.log('Enrollment failed:', res.status, JSON.stringify(res.body));
            }
            expect(res.status).to.equal(201);

            expect(res.body.studentId).to.equal(studentId);
            expect(res.body.courseId).to.equal(courseId);
        });

        it('POST /api/enroll should prevent duplicate enrollment', async () => {
            console.log('TEST: POST /api/enroll should prevent duplicate enrollment');
            await request(app)
                .post('/api/enroll')
                .send({ studentId, courseId })
                .expect(409);
        });

        it('GET /api/enroll should list enrollments', async () => {
            console.log('TEST: GET /api/enroll should list enrollments');
            const res = await request(app)
                .get('/api/enroll')
                .query({ studentId })
                .expect(200);

            expect(res.body.data).to.be.an('array');
            const found = res.body.data.find(e => e.studentId === studentId && e.courseId === courseId);
            expect(found).to.exist;
        });
    });

    describe('Attendance API', () => {
        const date = '2025-10-01';

        it('POST /api/attendance should mark attendance', async () => {
            const res = await request(app)
                .post('/api/attendance')
                .send({ studentId, courseId, date, status: 'present' })
                .expect(200);

            expect(res.body.ok).to.be.true;
            expect(res.body.result.inserted).to.equal(1);
        });

        it('POST /api/attendance should update attendance', async () => {
            const res = await request(app)
                .post('/api/attendance')
                .send({ studentId, courseId, date, status: 'absent', force: true })
                .expect(200);

            expect(res.body.result.updated).to.equal(1);
        });

        it('GET /api/attendance should list attendance', async () => {
            const res = await request(app)
                .get('/api/attendance')
                .query({ studentId, courseId })
                .expect(200);

            expect(res.body.data).to.be.an('array');
            const found = res.body.data.find(a => a.studentId === studentId && a.courseId === courseId && a.date === date);
            expect(found).to.exist;
            expect(found.status).to.equal('absent');
        });

        it('POST /api/attendance/upload-csv should validate missing fields', async () => {
            const csv = 'studentId,courseId,date,status\nS1,,2025-10-01,present';
            const res = await request(app)
                .post('/api/attendance/upload-csv')
                .send({ csv })
                .expect(400);

            expect(res.body.errors).to.include('missing required fields');
        });
    });
});
