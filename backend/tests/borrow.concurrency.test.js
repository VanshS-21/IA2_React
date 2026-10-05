process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://placeholder/shelflife';
process.env.JWT_SECRET = 'test-secret-with-enough-length';
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const { connectDb } = require('../src/config/db');
const Book = require('../src/models/Book');
const Member = require('../src/models/Member');
const Librarian = require('../src/models/Librarian');
const BorrowRecord = require('../src/models/BorrowRecord');

let mongo; let token; let book; let members;
jest.setTimeout(60000);
beforeAll(async () => { mongo = await MongoMemoryServer.create(); await connectDb(mongo.getUri()); });
beforeEach(async () => { await Promise.all([Book.deleteMany({}), Member.deleteMany({}), Librarian.deleteMany({}), BorrowRecord.deleteMany({})]); const librarian = await Librarian.create({ name: 'Test Librarian', email: 'test@example.test', passwordHash: await bcrypt.hash('Passw0rd!', 10) }); const login = await request(app).post('/api/auth/login').send({ email: librarian.email, password: 'Passw0rd!' }); token = login.body.data.token; book = await Book.create({ title: 'Last Copy', author: 'A. Author', isbn: '9780441478125', genre: 'Test', totalCopies: 1 }); members = await Member.insertMany(Array.from({ length: 10 }, (_, index) => ({ name: `Member ${index}`, email: `member${index}@example.test`, membershipId: `MEM-TEST${index}` }))); });
afterAll(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });

test('only one concurrent issue can reserve the final copy', async () => { const responses = await Promise.all(members.map((member) => request(app).post('/api/borrow').set('Authorization', `Bearer ${token}`).send({ bookId: book.id, memberId: member.id }))); expect(responses.filter((response) => response.status === 201)).toHaveLength(1); expect(responses.filter((response) => response.status === 409)).toHaveLength(9); expect((await Book.findById(book.id)).availableCopies).toBe(0); expect(await BorrowRecord.countDocuments({ status: 'issued' })).toBe(1); });
test('return increments stock and rejects a double return', async () => { const issued = await request(app).post('/api/borrow').set('Authorization', `Bearer ${token}`).send({ bookId: book.id, memberId: members[0].id }); const id = issued.body.data.borrowRecord._id; expect((await request(app).post(`/api/borrow/return/${id}`).set('Authorization', `Bearer ${token}`)).status).toBe(200); expect((await request(app).post(`/api/borrow/return/${id}`).set('Authorization', `Bearer ${token}`)).status).toBe(409); expect((await Book.findById(book.id)).availableCopies).toBe(1); });
test('auth and validation failures are explicit', async () => { expect((await request(app).post('/api/borrow').send({})).status).toBe(401); expect((await request(app).get('/api/books?page=zero')).status).toBe(400); });
