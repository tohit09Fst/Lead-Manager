import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../server.js';
import User from '../src/models/User.js';
import Lead from '../src/models/Lead.js';

dotenv.config();

const PORT = 5002;
let serverInstance;
let baseUrl = `http://localhost:${PORT}`;

let userAToken = '';
let userBToken = '';
let testLeadId = '';

describe('Full Stack Lead Manager API Test Suite', () => {
  before(async () => {
    // Start test server on port 5002
    serverInstance = app.listen(PORT);
  });

  after(async () => {
    // Clean up test users and leads
    await User.deleteMany({ email: { $in: ['test.user.a@test.com', 'test.user.b@test.com'] } });
    await Lead.deleteMany({ email: 'test.lead@example.com' });
    serverInstance.close();
  });

  test('1. Health check returns 200 OK', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
  });

  test('2. User Registration & Validation', async () => {
    // Attempt registration with missing password
    const failRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User A', email: 'test.user.a@test.com' })
    });
    assert.strictEqual(failRes.status, 400);

    // Register User A successfully
    const successRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'User A',
        email: 'test.user.a@test.com',
        password: 'password123'
      })
    });
    assert.strictEqual(successRes.status, 201);
    const resData = await successRes.json();
    assert.strictEqual(resData.success, true);
    assert.ok(resData.data.token, 'Should return JWT token');
    userAToken = resData.data.token;
  });

  test('3. User Login', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.user.a@test.com',
        password: 'password123'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data.token);
  });

  test('4. Protected Routes Reject Unauthorized Requests', async () => {
    const res = await fetch(`${baseUrl}/api/leads`);
    assert.strictEqual(res.status, 401);
  });

  test('5. Lead Creation and Input Validation', async () => {
    // Bad email validation
    const badRes = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`
      },
      body: JSON.stringify({
        name: 'Test Lead',
        email: 'invalid-email',
        phone: '12345678',
        company: 'Company',
        source: 'Website',
        status: 'New'
      })
    });
    assert.strictEqual(badRes.status, 400);
    const badData = await badRes.json();
    assert.ok(badData.errors.email);

    // Valid lead creation
    const goodRes = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`
      },
      body: JSON.stringify({
        name: 'Test Lead',
        email: 'test.lead@example.com',
        phone: '+1 555-010-0099',
        company: 'Test Corp',
        source: 'LinkedIn',
        status: 'New'
      })
    });
    assert.strictEqual(goodRes.status, 201);
    const goodData = await goodRes.json();
    assert.strictEqual(goodData.success, true);
    assert.strictEqual(goodData.data.name, 'Test Lead');
    testLeadId = goodData.data._id;
  });

  test('6. Pagination, Sorting & Metrics Count', async () => {
    const res = await fetch(`${baseUrl}/api/leads?page=1&limit=5&sortBy=name&sortOrder=asc`, {
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.pagination);
    assert.strictEqual(data.pagination.page, 1);
    assert.ok(data.metrics);
    assert.ok(data.metrics.total >= 1);
  });

  test('7. Multi-User Isolation (User B cannot see or delete User A leads)', async () => {
    // Register User B
    const regB = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'User B',
        email: 'test.user.b@test.com',
        password: 'password123'
      })
    });
    const regBData = await regB.json();
    userBToken = regBData.data.token;

    // User B fetches leads - should have 0 leads
    const listRes = await fetch(`${baseUrl}/api/leads`, {
      headers: { Authorization: `Bearer ${userBToken}` }
    });
    const listData = await listRes.json();
    assert.strictEqual(listData.data.length, 0);

    // User B tries to delete User A's lead - should return 404
    const delRes = await fetch(`${baseUrl}/api/leads/${testLeadId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userBToken}` }
    });
    assert.strictEqual(delRes.status, 404);
  });

  test('8. Update Lead Status', async () => {
    const updateRes = await fetch(`${baseUrl}/api/leads/${testLeadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAToken}`
      },
      body: JSON.stringify({ status: 'Qualified' })
    });
    assert.strictEqual(updateRes.status, 200);
    const updateData = await updateRes.json();
    assert.strictEqual(updateData.data.status, 'Qualified');
  });

  test('9. Delete Lead with Confirmation Step endpoint', async () => {
    const delRes = await fetch(`${baseUrl}/api/leads/${testLeadId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userAToken}` }
    });
    assert.strictEqual(delRes.status, 200);
    const delData = await delRes.json();
    assert.strictEqual(delData.success, true);
  });
});
