const request = require('supertest');
const express = require('express');
const User = require('../models/User');
const authRoutes = require('./authRoutes');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(authRoutes);

jest.mock('../models/User');

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /register', () => {
        const mockUser = {
            email: 'test@test.com',
            password: 'password123',
            generateAuthToken: jest.fn().mockReturnValue('mockToken')
        };

        it('should register a new user successfully', async () => {
            User.mockImplementation(() => mockUser);
            mockUser.save = jest.fn();

            const response = await request(app)
                .post('/register')
                .send({
                    email: 'test@test.com',
                    password: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token', 'mockToken');
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('should return 400 if registration fails', async () => {
            User.mockImplementation(() => mockUser);
            mockUser.save = jest.fn().mockRejectedValue(new Error('Registration failed'));

            const response = await request(app)
                .post('/register')
                .send({
                    email: 'test@test.com',
                    password: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Registration failed');
        });
    });

    describe('POST /login', () => {
        const mockUser = {
            email: 'test@test.com',
            password: 'hashedPassword',
            generateAuthToken: jest.fn().mockReturnValue('mockToken')
        };

        it('should login user successfully with correct credentials', async () => {
            User.findOne = jest.fn().mockResolvedValue(mockUser);
            bcrypt.compare = jest.fn().mockResolvedValue(true);

            const response = await request(app)
                .post('/login')
                .send({
                    email: 'test@test.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token', 'mockToken');
        });

        it('should return 400 if user not found', async () => {
            User.findOne = jest.fn().mockResolvedValue(null);

            const response = await request(app)
                .post('/login')
                .send({
                    email: 'test@test.com',
                    password: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Invalid credentials');
        });

        it('should return 400 if password is incorrect', async () => {
            User.findOne = jest.fn().mockResolvedValue(mockUser);
            bcrypt.compare = jest.fn().mockResolvedValue(false);

            const response = await request(app)
                .post('/login')
                .send({
                    email: 'test@test.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Invalid credentials');
        });
    });
});