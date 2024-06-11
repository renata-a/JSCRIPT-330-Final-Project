const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Pattern = require('../models/Pattern');

let server;
let token;
let userId;

beforeAll(async () => {
    server = app.listen(3000, () => {
        console.log('Testing server running on port 3000');
    });
    await User.deleteMany();
    await Pattern.deleteMany();

    const userRes = await request(server)
        .post('/users/register')
        .send({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
        });

    userId = userRes.body._id;

    const loginRes = await request(server)
        .post('/users/login')
        .send({
            email: 'testuser@example.com',
            password: 'password123',
        });

    token = loginRes.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});

describe('POST /patterns', () => {
    it('should create a new pattern', async () => {
        const res = await request(server)
            .post('/patterns')
            .set('Authorization', `Bearer ${token}`)
            .send({
                link: 'http://example.com',
                type: 'knitting',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.link).toBe('http://example.com');
        expect(res.body.type).toBe('knitting');
    });

    it('should return 400 if link is missing', async () => {
        const res = await request(server)
        .post('/patterns')
        .set('Authorization', `Bearer ${token}`)
        .send({
            type: 'knitting',
        });

        expect(res.statusCode).toEqual(400);
    });
});

describe('GET /patterns', () => {
    it('should get all patterns for the authenticated user', async () => {
        const res = await request(server)
        .get('/patterns')
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe('GET /patterns/type/:type', () => {
    it('should get all patterns by type for the authenticated user', async () => {
        const res = await request(server)
            .get('/patterns/type/knitting')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        res.body.forEach(pattern => {
            expect(pattern.type).toBe('knitting');
        });
    });

    it('should return 404 if no patterns of the specified type are found', async () => {
        const res = await request(server)
        .get('/patterns/type/nonexistent')
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(404);
    });
});

describe('PATCH /patterns/:id', () => {
    let patternId;

    beforeAll(async () => {
        const pattern = new Pattern({
            link: 'http://example.com',
            type: 'knitting',
            createdBy: userId,
        });
        await pattern.save();
        patternId = pattern._id;
    });

    it('should update the pattern', async () => {
        const res = await request(server)
        .patch(`/patterns/${patternId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            type: 'crocheting',
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.type).toBe('crocheting');
    });

    it('should return 400 for invalid updates', async () => {
        const res = await request(server)
        .patch(`/patterns/${patternId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            invalidField: 'Invalid',
        });

        expect(res.statusCode).toEqual(400);
    });
});

describe('DELETE /patterns/:id', () => {
    let patternId;

    beforeAll(async () => {
        const pattern = new Pattern({
            link: 'http://example.com',
            type: 'knitting',
            createdBy: userId,
        });
        await pattern.save();
        patternId = pattern._id;
    });

    it('should delete the pattern for admin user', async () => {
    // Make the user an admin
        await User.updateOne({ _id: userId }, { role: 'admin' });

        const res = await request(server)
        .delete(`/patterns/${patternId}`)
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
    });

    it('should return 403 for non-admin user', async () => {
    // Make the user a non-admin
        await User.updateOne({ _id: userId }, { role: 'user' });

        const res = await request(server)
        .delete(`/patterns/${patternId}`)
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(403);
    });
});
