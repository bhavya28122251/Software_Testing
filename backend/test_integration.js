const path = require('path');
const fs = require('fs');

const TEST_DB_PATH = path.join(__dirname, 'test', 'integration', 'integration_test.db');
process.env.DB_PATH = TEST_DB_PATH;

if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
}

const db = require('./db');
const app = require('./server');

async function test() {
    try {
        console.log('Waiting for DB to be ready...');
        await db.waitForReady();
        console.log('DB is ready!');

        const request = require('supertest');
        console.log('Testing POST /api/students...');
        const res = await request(app)
            .post('/api/students')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                dob: '2000-01-01'
            });

        console.log('Status:', res.status);
        console.log('Body:', res.body);

        if (fs.existsSync(TEST_DB_PATH)) {
            fs.unlinkSync(TEST_DB_PATH);
        }
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

test();
