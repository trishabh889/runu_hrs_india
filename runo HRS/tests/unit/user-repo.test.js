// ==========================================================================
// RUNO HRS MIS - Unit Test: User Repository & RBAC (AUTH-01, AUTH-03, USER-01)
// ==========================================================================

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const UserRepository = require('../../db/repositories/userRepo');

describe('UserRepository Authentication & Approval (AUTH-01, AUTH-03)', () => {
  const fakeDb = {
    data: {
      users: [
        {
          id: 'usr-001',
          username: 'TESTADMIN',
          password: 'ADMIN',
          role: 'ADMIN',
          is_approved: true,
          status: 'ACTIVE'
        },
        {
          id: 'usr-002',
          username: 'PENDINGUSER',
          password: 'SECRET',
          role: 'SALES',
          is_approved: false,
          status: 'PENDING_APPROVAL'
        }
      ]
    },
    save: () => true
  };

  const repo = new UserRepository(fakeDb);

  test('Valid credentials of approved user authenticate successfully', () => {
    const res = repo.authenticate('testadmin', 'ADMIN');
    assert.equal(res.success, true);
    assert.equal(res.user.username, 'TESTADMIN');
    assert.equal(res.user.password, undefined); // Password stripped for safety
  });

  test('Invalid credentials fail authentication with clear error', () => {
    const res = repo.authenticate('testadmin', 'WRONGPASS');
    assert.equal(res.success, false);
    assert.match(res.message, /Invalid Username/i);
  });

  test('Unapproved user is blocked until admin approval (AUTH-03)', () => {
    const res = repo.authenticate('PENDINGUSER', 'SECRET');
    assert.equal(res.success, false);
    assert.equal(res.pendingApproval, true);
    assert.match(res.message, /Admin approval is required/i);
  });

  test('Registration creates user in pending approval state', () => {
    const created = repo.create({
      username: 'NEWUSER',
      password: 'PASSWORD123',
      role: 'DESIGN'
    });

    assert.equal(created.success, true);
    assert.equal(created.user.is_approved, false);
    assert.equal(created.user.status, 'PENDING_APPROVAL');
  });
});
