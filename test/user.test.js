const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

let server;
let token;

beforeAll(async () => {
    server = app.listen(3000, () => {
        console.log('Testing server running on port 3000');
    });
    await User.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});

describe('POST /register', () => {
    it('should register a new user', async () => {
        const res = await request(server)
            .post('/users/register')
            .send({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
        });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Test User');
    expect(res.body.email).toBe('testuser@example.com');
    });

    it('should return 400 if email is missing', async () => {
        const res = await request(server)
            .post('/users/register')
            .send({
                name: 'Test User',
                password: 'password123',
            });

    expect(res.statusCode).toEqual(400);
    });
});

describe('POST /login', () => {
    it('should login an existing user', async () => {
        const res = await request(server)
            .post('/users/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should return 400 if email is incorrect', async () => {
        const res = await request(server)
            .post('/users/login')
            .send({
                email: 'wrongemail@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(400);
    });
});

describe('GET /me', () => {
    it('should get the authenticated user profile', async () => {
        const res = await request(server)
            .get('/users/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.email).toBe('testuser@example.com');
    });

    it('should return 401 for unauthenticated user', async () => {
        const res = await request(server).get('/users/me');
        expect(res.statusCode).toEqual(401);
    });
});

describe('DELETE /me', () => {
    it('should delete the authenticated user profile', async () => {
        const res = await request(server)
        .delete('/users/me')
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
    });

    it('should return 401 for unauthenticated user', async () => {
        const res = await request(server).delete('/users/me');
        expect(res.statusCode).toEqual(401);
    });
});
