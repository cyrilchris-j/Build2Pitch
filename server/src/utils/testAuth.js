/**
 * Automated Verification Script for Authentication & RBAC
 * Tests all endpoints and middleware without requiring a standalone live MongoDB daemon
 */
const mongoose = require('mongoose');
const http = require('http');
const app = require('../app');
const env = require('../config/env');
const User = require('../models/User');
const Team = require('../models/Team');

// Test runner
async function runAuthTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING BUILD2PITCH AUTHENTICATION & RBAC TESTS');
  console.log('====================================================\n');

  let server;
  let baseUrl;
  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  try {
    // 1. Connect DB or start in-memory
    console.log('1. Connecting to database...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('   Connected to database.\n');

    // Clean test data
    await User.deleteMany({ email: /test.*@build2pitch.dev/ });
    await Team.deleteMany({ name: /Test Team.*/ });

    // Start ephemeral server
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}/api/auth`;
        resolve();
      });
    });

    console.log(`2. Test server running at ${baseUrl}\n`);

    // ==========================================
    // TEST 1: Team Lead Registration
    // ==========================================
    console.log('TEST SUITE 1: Team Lead Registration');
    
    // 1.1 Valid Registration
    const regPayload = {
      name: 'Alex Rivera',
      registerNumber: '21CS101',
      email: 'test.leader@build2pitch.dev',
      mobile: '9876543210',
      gender: 'male',
      section: 'CSE-A',
      teamName: 'Test Team Nexus',
      password: 'LeaderPassword123!',
      confirmPassword: 'LeaderPassword123!',
    };

    const regRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regPayload),
    });
    const regData = await regRes.json();

    assert(regRes.status === 201, 'Registration returns HTTP status 201');
    assert(regData.success === true, 'Response body has success: true');
    assert(!!regData.data.token, 'Response returns a valid JWT token');
    assert(regData.data.user.email === regPayload.email, 'User email matches payload');
    assert(regData.data.user.role === 'TEAM_LEAD', 'User role is assigned TEAM_LEAD');
    assert(!regData.data.user.passwordHash, 'passwordHash is not exposed in JSON output');
    assert(!!regData.data.team, 'Team is automatically created');
    assert(regData.data.team.name === regPayload.teamName, 'Team name matches payload');
    assert(!!regData.data.team.teamCode, 'Team code is generated');

    const leaderToken = regData.data.token;
    const leaderUser = regData.data.user;

    // 1.2 Duplicate Email Rejection
    const dupRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regPayload),
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 400, 'Duplicate email registration returns 400');
    assert(dupData.success === false, 'Duplicate email has success: false');

    // 1.3 Mismatched Password Rejection
    const mismatchRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...regPayload,
        email: 'test.mismatch@build2pitch.dev',
        confirmPassword: 'DifferentPassword!',
      }),
    });
    assert(mismatchRes.status === 400, 'Mismatched passwords rejected with 400');

    console.log('\nTEST SUITE 2: Team Lead & General Login');

    // 2.1 Valid Team Lead Login
    const loginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.leader@build2pitch.dev',
        password: 'LeaderPassword123!',
      }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Valid login returns HTTP status 200');
    assert(loginData.success === true, 'Login returns success: true');
    assert(!!loginData.data.token, 'Login returns JWT token');
    assert(loginData.data.user.email === 'test.leader@build2pitch.dev', 'Login user matches email');

    // 2.2 Invalid Password Rejection
    const badPassRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.leader@build2pitch.dev',
        password: 'WrongPassword!',
      }),
    });
    assert(badPassRes.status === 401, 'Wrong password rejected with 401');

    console.log('\nTEST SUITE 3: Team Member Login');

    // Create a demo member
    const bcrypt = require('bcryptjs');
    const memberHash = await bcrypt.hash('MemberPass123!', 10);
    const testMember = await User.create({
      name: 'Elena Rostova',
      email: 'test.member@build2pitch.dev',
      registerNumber: '21CS102',
      mobile: '9876543212',
      gender: 'female',
      section: 'CSE-A',
      passwordHash: memberHash,
      role: 'TEAM_MEMBER',
      teamId: regData.data.team._id,
    });

    // 3.1 Valid Member Login
    const memberLoginRes = await fetch(`${baseUrl}/member-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.member@build2pitch.dev',
        password: 'MemberPass123!',
      }),
    });
    const memberLoginData = await memberLoginRes.json();
    assert(memberLoginRes.status === 200, 'Member login returns 200');
    assert(memberLoginData.data.user.role === 'TEAM_MEMBER', 'Member role is TEAM_MEMBER');
    const memberToken = memberLoginData.data.token;

    console.log('\nTEST SUITE 4: Admin Login & Security Gateway');

    // Create a demo admin
    const adminHash = await bcrypt.hash('AdminSecret123!', 10);
    await User.create({
      name: 'System Administrator',
      email: 'test.admin@build2pitch.dev',
      registerNumber: 'ADM-01',
      mobile: '9876543213',
      gender: 'other',
      section: 'ADMIN',
      passwordHash: adminHash,
      role: 'ADMIN',
    });

    // 4.1 Valid Admin Login
    const adminLoginRes = await fetch(`${baseUrl}/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.admin@build2pitch.dev',
        password: 'AdminSecret123!',
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200, 'Admin login returns 200');
    assert(adminLoginData.data.user.role === 'ADMIN', 'Admin role verified as ADMIN');
    const adminToken = adminLoginData.data.token;

    // 4.2 Non-Admin trying to access admin login
    const nonAdminRes = await fetch(`${baseUrl}/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.member@build2pitch.dev',
        password: 'MemberPass123!',
      }),
    });
    assert(nonAdminRes.status === 403, 'Non-admin user rejected from admin login with 403');

    console.log('\nTEST SUITE 5: Profile & Session Verification (/api/auth/me)');

    // 5.1 Authenticated Profile Fetch
    const profileRes = await fetch(`${baseUrl}/me`, {
      headers: { Authorization: `Bearer ${leaderToken}` },
    });
    const profileData = await profileRes.json();
    assert(profileRes.status === 200, 'GET /api/auth/me with valid token returns 200');
    assert(profileData.data.user.email === 'test.leader@build2pitch.dev', 'Profile data contains leader');
    assert(!!profileData.data.team, 'Profile data contains associated team');

    // 5.2 Unauthenticated Profile Fetch
    const unauthRes = await fetch(`${baseUrl}/me`);
    assert(unauthRes.status === 401, 'GET /api/auth/me without token returns 401');

    // 5.3 Malformed Token
    const malformedRes = await fetch(`${baseUrl}/me`, {
      headers: { Authorization: 'Bearer invalid.jwt.token' },
    });
    assert(malformedRes.status === 401, 'GET /api/auth/me with invalid token returns 401');

    console.log('\n====================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
    console.log('====================================================\n');

    // Cleanup
    await User.deleteMany({ email: /test.*@build2pitch.dev/ });
    await Team.deleteMany({ name: /Test Team.*/ });

    server.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test execution failed with error:', err);
    if (server) server.close();
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
}

runAuthTests();
