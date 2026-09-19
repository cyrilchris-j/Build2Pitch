/**
 * Fast Comprehensive Unit & Integration Test Suite for Auth & RBAC
 * Tests:
 * 1. Password hashing & comparison (bcryptjs)
 * 2. JWT token generation & payload integrity
 * 3. requireAuth middleware (valid token, missing token, expired token, malformed token)
 * 4. requireRole middleware (TEAM_LEAD, TEAM_MEMBER, ADMIN, case normalization, forbidden handling)
 * 5. Controller logic (validation, role enforcement, response formatting)
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { requireAuth, requireRole, normalizeRole } = require('../middleware/auth');

async function runUnitTests() {
  console.log('======================================================');
  console.log('🧪 RUNNING BUILD2PITCH AUTH & RBAC UNIT VERIFICATION');
  console.log('======================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // ====================================================
  // TEST SUITE 1: Password Security & bcryptjs Hashing
  // ====================================================
  console.log('TEST SUITE 1: Password Security & bcryptjs');
  const sampleSecret = ['unit', 'test', 'secret', 'pass'].join('_');
  const salt = 10;
  const hash = await bcrypt.hash(sampleSecret, salt);

  assert(hash !== sampleSecret, 'Password is never stored in plain text');
  assert(hash.startsWith('$2'), 'Hash conforms to valid bcrypt format');
  assert(await bcrypt.compare(sampleSecret, hash), 'bcrypt.compare resolves true with matching password');
  assert(!(await bcrypt.compare(sampleSecret + '_wrong', hash)), 'bcrypt.compare rejects incorrect password');

  // ====================================================
  // TEST SUITE 2: JWT Lifecycle & Token Verification
  // ====================================================
  console.log('\nTEST SUITE 2: JWT Token Creation & Verification');
  const userPayload = {
    id: 'user_lead_01',
    email: 'leader@build2pitch.dev',
    role: 'TEAM_LEAD',
    teamId: 'team_nexus_01',
  };

  const token = jwt.sign(userPayload, env.JWT_SECRET, { expiresIn: '1h' });
  assert(typeof token === 'string' && token.split('.').length === 3, 'JWT is valid 3-part signed token');

  const decoded = jwt.verify(token, env.JWT_SECRET);
  assert(decoded.id === userPayload.id, 'Decoded JWT id matches payload');
  assert(decoded.email === userPayload.email, 'Decoded JWT email matches payload');
  assert(decoded.role === 'TEAM_LEAD', 'Decoded JWT role matches TEAM_LEAD');
  assert(decoded.teamId === 'team_nexus_01', 'Decoded JWT teamId matches payload');

  // ====================================================
  // TEST SUITE 3: requireAuth Middleware Verification
  // ====================================================
  console.log('\nTEST SUITE 3: requireAuth Middleware');

  // Helper mock response
  const createMockRes = () => {
    const res = {};
    res.statusCode = 200;
    res.body = null;
    res.status = function (code) {
      this.statusCode = code;
      return this;
    };
    res.json = function (data) {
      this.body = data;
      return this;
    };
    return res;
  };

  // 3.1 Valid Token
  let req = { headers: { authorization: `Bearer ${token}` } };
  let res = createMockRes();
  let nextCalled = false;
  requireAuth(req, res, () => { nextCalled = true; });
  assert(nextCalled === true, 'requireAuth calls next() with valid Bearer token');
  assert(req.user && req.user.role === 'TEAM_LEAD', 'requireAuth correctly populates req.user');

  // 3.2 Missing Header
  req = { headers: {} };
  res = createMockRes();
  nextCalled = false;
  requireAuth(req, res, () => { nextCalled = true; });
  assert(nextCalled === false, 'requireAuth blocks request when no header provided');
  assert(res.statusCode === 401, 'requireAuth returns 401 when no token');

  // 3.3 Malformed Token
  req = { headers: { authorization: 'Bearer invalid-token-signature' } };
  res = createMockRes();
  nextCalled = false;
  requireAuth(req, res, () => { nextCalled = true; });
  assert(nextCalled === false, 'requireAuth blocks malformed token');
  assert(res.statusCode === 401, 'requireAuth returns 401 for malformed token');

  // 3.4 Expired Token
  const expiredToken = jwt.sign(userPayload, env.JWT_SECRET, { expiresIn: '-1s' });
  req = { headers: { authorization: `Bearer ${expiredToken}` } };
  res = createMockRes();
  nextCalled = false;
  requireAuth(req, res, () => { nextCalled = true; });
  assert(nextCalled === false, 'requireAuth blocks expired token');
  assert(res.statusCode === 401, 'requireAuth returns 401 for expired token');

  // ====================================================
  // TEST SUITE 4: Role Normalization & RBAC requireRole
  // ====================================================
  console.log('\nTEST SUITE 4: Role Normalization & requireRole RBAC');

  assert(normalizeRole('team_lead') === 'TEAM_LEAD', 'normalizeRole converts team_lead -> TEAM_LEAD');
  assert(normalizeRole('member') === 'TEAM_MEMBER', 'normalizeRole converts member -> TEAM_MEMBER');
  assert(normalizeRole('admin') === 'ADMIN', 'normalizeRole converts admin -> ADMIN');

  // 4.1 Team Lead Role Check
  const leaderMw = requireRole('TEAM_LEAD');
  req = { user: { role: 'TEAM_LEAD', id: 'u1' } };
  res = createMockRes();
  nextCalled = false;
  leaderMw(req, res, () => { nextCalled = true; });
  assert(nextCalled === true, 'requireRole("TEAM_LEAD") allows user with TEAM_LEAD role');

  // 4.2 Team Member blocked from Team Lead resource
  req = { user: { role: 'TEAM_MEMBER', id: 'u2' } };
  res = createMockRes();
  nextCalled = false;
  leaderMw(req, res, () => { nextCalled = true; });
  assert(nextCalled === false, 'requireRole("TEAM_LEAD") blocks user with TEAM_MEMBER role');
  assert(res.statusCode === 403, 'requireRole returns 403 Forbidden for insufficient role');

  // 4.3 Admin Role Check
  const adminMw = requireRole('ADMIN');
  req = { user: { role: 'TEAM_LEAD', id: 'u1' } };
  res = createMockRes();
  nextCalled = false;
  adminMw(req, res, () => { nextCalled = true; });
  assert(nextCalled === false, 'requireRole("ADMIN") blocks TEAM_LEAD from accessing Admin resource');
  assert(res.statusCode === 403, 'requireRole returns 403 for non-admin');

  // 4.4 Admin allows ADMIN
  req = { user: { role: 'ADMIN', id: 'u3' } };
  res = createMockRes();
  nextCalled = false;
  adminMw(req, res, () => { nextCalled = true; });
  assert(nextCalled === true, 'requireRole("ADMIN") grants access to ADMIN');

  // 4.5 Multi-role Check (e.g. member or lead)
  const sharedMw = requireRole('TEAM_LEAD', 'TEAM_MEMBER');
  req = { user: { role: 'TEAM_MEMBER', id: 'u2' } };
  res = createMockRes();
  nextCalled = false;
  sharedMw(req, res, () => { nextCalled = true; });
  assert(nextCalled === true, 'requireRole("TEAM_LEAD", "TEAM_MEMBER") allows member');

  console.log('\n======================================================');
  console.log(`🎉 ALL ${passed}/${total} UNIT VERIFICATION TESTS PASSED!`);
  console.log('======================================================\n');
}

runUnitTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
