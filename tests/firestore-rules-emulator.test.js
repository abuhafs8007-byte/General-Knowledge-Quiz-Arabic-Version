/**
 * Exercises the deployed Firestore rules contract locally without touching
 * production data. Run with:
 * firebase emulators:exec --only firestore,auth --project demo-arabic-cbt-rules "node tests/firestore-rules-emulator.test.js"
 */

const assert = require('assert');

const projectId = process.env.GCLOUD_PROJECT || 'demo-arabic-cbt-rules';
const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
const firestoreBase = `http://${firestoreHost}/v1/projects/${projectId}/databases/(default)/documents`;
let assertionCount = 0;

function encodeValue(value) {
    if (value === null) return { nullValue: 'NULL_VALUE' };
    if (typeof value === 'string') return { stringValue: value };
    if (typeof value === 'boolean') return { booleanValue: value };
    if (typeof value === 'number') {
        return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
    }
    if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
    if (typeof value === 'object') {
        return {
            mapValue: {
                fields: Object.fromEntries(Object.entries(value).map(([key, child]) => [key, encodeValue(child)]))
            }
        };
    }
    throw new TypeError(`Unsupported Firestore test value: ${typeof value}`);
}

function encodeFields(fields) {
    return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, encodeValue(value)]));
}

async function request(url, { method = 'GET', token, body } = {}) {
    const response = await fetch(url, {
        method,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(body ? { 'Content-Type': 'application/json' } : {})
        },
        ...(body ? { body: JSON.stringify(body) } : {})
    });
    const responseBody = await response.json().catch(() => ({}));
    return { status: response.status, body: responseBody };
}

async function expectAllowed(url, options) {
    assertionCount += 1;
    const result = await request(url, options);
    assert.ok(result.status >= 200 && result.status < 300, `expected allow, received ${result.status}: ${JSON.stringify(result.body)}`);
    return result.body;
}

async function expectDenied(url, options) {
    assertionCount += 1;
    const result = await request(url, options);
    assert.strictEqual(result.status, 403, `expected permission denial, received ${result.status}: ${JSON.stringify(result.body)}`);
}

async function createAuthUser(email) {
    const response = await request(
        `http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`,
        {
            method: 'POST',
            body: { email, password: 'emulator-only-password' }
        }
    );
    assert.ok(response.status >= 200 && response.status < 300, `Auth emulator sign-up failed: ${JSON.stringify(response.body)}`);
    return response.body.idToken;
}

async function main() {
    const adminToken = await createAuthUser('abuhafs8007@gmail.com');
    const otherAdminToken = await createAuthUser('not-the-admin@example.test');
    const studentId = 'RULES-TEST-001';
    const subjectId = 'balagha_3';
    const attemptId = `id:${studentId}__${subjectId}`;
    const studentPath = `${firestoreBase}/students/${studentId}`;
    const attemptPath = `${firestoreBase}/attempts/${encodeURIComponent(attemptId)}`;
    const statusPath = `${firestoreBase}/attemptStatus/${encodeURIComponent(attemptId)}`;

    await expectAllowed(studentPath, {
        method: 'PATCH',
        token: 'owner',
        body: { fields: encodeFields({ id: studentId, studentId, name: 'Rules Test Student', className: 'JSS 2' }) }
    });
    await expectAllowed(`${firestoreBase}/subjects/${subjectId}`, {
        method: 'PATCH',
        token: 'owner',
        body: { fields: encodeFields({ id: subjectId, name: 'اختبار القواعد', isEnabled: true, durationMinutes: 30 }) }
    });

    await expectAllowed(studentPath);
    await expectDenied(`${firestoreBase}/students`);
    await expectAllowed(`${firestoreBase}/subjects/${subjectId}`);
    await expectDenied(`${firestoreBase}/subjects/${subjectId}`, {
        method: 'PATCH',
        body: { fields: encodeFields({ id: subjectId, name: 'Unauthorized', isEnabled: false }) }
    });

    await expectDenied(`${firestoreBase}/attempts?documentId=${encodeURIComponent(attemptId)}`, {
        method: 'POST',
        body: { fields: encodeFields({
            id: attemptId,
            studentKey: 'id:rules-test-001',
            studentName: 'Rules Test Student',
            studentId,
            name: 'Rules Test Student',
            class: 'SS 1',
            className: 'SS 1',
            subject: 'اختبار القواعد',
            subjectId,
            subjectName: 'اختبار القواعد',
            score: 0,
            percentage: 0,
            totalQuestions: 1,
            answeredCount: 0,
            unansweredCount: 1,
            status: 'In Progress',
            timeUsed: '00:00',
            timestamp: new Date().toISOString(),
            dateStarted: new Date().toISOString(),
            durationMinutes: 30
        }) }
    });

    const attempt = {
        id: attemptId,
        studentKey: 'id:rules-test-001',
        studentName: 'Rules Test Student',
        studentId,
        name: 'Rules Test Student',
        class: 'JSS 2',
        className: 'JSS 2',
        subject: 'اختبار القواعد',
        subjectId,
        subjectName: 'اختبار القواعد',
        score: 0,
        percentage: 0,
        totalQuestions: 1,
        answeredCount: 0,
        unansweredCount: 1,
        status: 'In Progress',
        timeUsed: '00:00',
        timestamp: new Date().toISOString(),
        dateStarted: new Date().toISOString(),
        durationMinutes: 30
    };
    await expectAllowed(`${firestoreBase}/attempts?documentId=${encodeURIComponent(attemptId)}`, {
        method: 'POST',
        body: { fields: encodeFields(attempt) }
    });

    const marker = { studentId, subjectId, status: 'In Progress' };
    await expectAllowed(`${firestoreBase}/attemptStatus?documentId=${encodeURIComponent(attemptId)}`, {
        method: 'POST',
        body: { fields: encodeFields(marker) }
    });
    const publicMarker = await expectAllowed(statusPath);
    assert.deepStrictEqual(Object.keys(publicMarker.fields).sort(), ['status', 'studentId', 'subjectId']);
    await expectDenied(attemptPath);
    await expectDenied(`${firestoreBase}/attempts`);
    await expectDenied(`${firestoreBase}/attemptStatus?documentId=id%3ARULES-TEST-UNKNOWN__${subjectId}`, {
        method: 'POST',
        body: { fields: encodeFields({
            studentId: 'RULES-TEST-UNKNOWN',
            subjectId,
            status: 'In Progress'
        }) }
    });

    await expectDenied(attemptPath, {
        method: 'PATCH',
        body: { fields: encodeFields({ ...attempt, class: 'SS 1', className: 'SS 1' }) }
    });

    const completedAttempt = {
        ...attempt,
        score: 1,
        percentage: 100,
        answeredCount: 1,
        unansweredCount: 0,
        status: 'Completed',
        dateCompleted: new Date().toISOString()
    };
    await expectAllowed(attemptPath, {
        method: 'PATCH',
        body: { fields: encodeFields(completedAttempt) }
    });
    await expectAllowed(statusPath, {
        method: 'PATCH',
        body: { fields: encodeFields({ ...marker, status: 'Completed' }) }
    });
    await expectDenied(attemptPath, {
        method: 'PATCH',
        body: { fields: encodeFields({ ...completedAttempt, score: 0 }) }
    });
    await expectDenied(`${firestoreBase}/attempts?documentId=${encodeURIComponent(attemptId)}`, {
        method: 'POST',
        body: { fields: encodeFields(completedAttempt) }
    });

    await expectDenied(`${firestoreBase}/attempts?documentId=id%3ARULES-TEST-EXTRA__${subjectId}`, {
        method: 'POST',
        body: { fields: encodeFields({ ...attempt, id: `id:RULES-TEST-EXTRA__${subjectId}`, studentId: 'RULES-TEST-EXTRA', answers: [0] }) }
    });
    await expectDenied(`${firestoreBase}/attemptStatus?documentId=id%3ARULES-TEST-EXTRA__${subjectId}`, {
        method: 'POST',
        body: { fields: encodeFields({ ...marker, answers: [0] }) }
    });

    const seniorStudentId = 'RULES-TEST-SS1';
    await expectAllowed(`${firestoreBase}/students/${seniorStudentId}`, {
        method: 'PATCH',
        token: 'owner',
        body: { fields: encodeFields({
            id: seniorStudentId,
            studentId: seniorStudentId,
            name: 'Rules Test Senior Student',
            className: 'SS1'
        }) }
    });
    const seniorSubjectId = 'ss1_test_subject';
    const seniorAttemptId = `id:${seniorStudentId}__${seniorSubjectId}`;
    await expectAllowed(`${firestoreBase}/attempts?documentId=${encodeURIComponent(seniorAttemptId)}`, {
        method: 'POST',
        body: { fields: encodeFields({
            ...attempt,
            id: seniorAttemptId,
            studentKey: `id:${seniorStudentId.toLowerCase()}`,
            studentName: 'Rules Test Senior Student',
            studentId: seniorStudentId,
            name: 'Rules Test Senior Student',
            class: 'SS 1',
            className: 'SS 1',
            subjectId: seniorSubjectId,
            subject: 'اختبار الصف الثانوي',
            subjectName: 'اختبار الصف الثانوي'
        }) }
    });

    await expectAllowed(`${firestoreBase}/students`, { token: adminToken });
    await expectAllowed(attemptPath, { token: adminToken });
    await expectDenied(`${firestoreBase}/students`, { token: otherAdminToken });

    console.log(`Firestore emulator rules: ${assertionCount} allow/deny assertions passed.`);
}

main().catch(error => {
    console.error('Firestore rules emulator test failed:', error);
    process.exitCode = 1;
});
