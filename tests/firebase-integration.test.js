/**
 * Node-based verification for the Phase 2 Firebase integration.
 *
 * These tests cover the pure logic the security model depends on:
 *  - the deterministic attempt-ID scheme (the rules pin document IDs to it),
 *  - the Firebase config placeholder detection that gates the whole app,
 *  - the localStorage write policy (private data must never be cached),
 *  - the firestore.rules least-privilege contract,
 *  - the script load order in index.html,
 *  - the removal of hardcoded admin credentials.
 *
 * They do NOT touch the network or a real Firebase project. Run with:
 *     node tests/firebase-integration.test.js
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function test(name, fn) {
    // Supports both sync and async test bodies.
    return Promise.resolve()
        .then(fn)
        .then(() => {
            passed += 1;
            console.log(`  ok  ${name}`);
        })
        .catch(error => {
            failed += 1;
            console.error(`  FAIL ${name}`);
            console.error(`       ${error.message}`);
        });
}

function read(file) {
    return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

// --- Minimal browser-ish globals so the real files can be evaluated ----------
function makeSandbox(overrides = {}) {
    const store = new Map();
    const sandbox = {
        console,
        navigator: { onLine: true },
        Blob: class {
            constructor(parts) {
                this.size = Buffer.byteLength(String(parts[0]), 'utf8');
            }
        },
        localStorage: {
            getItem: key => (store.has(key) ? store.get(key) : null),
            setItem: (key, value) => store.set(key, String(value)),
            removeItem: key => store.delete(key),
            get length() { return store.size; },
            key: index => Array.from(store.keys())[index] ?? null
        },
        setTimeout,
        clearTimeout,
        Promise,
        Map,
        Set,
        Object,
        Array,
        String,
        Number,
        JSON,
        Error,
        ...overrides
    };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    return { sandbox, store };
}

function runInSandbox(filename, sandbox) {
    vm.createContext(sandbox);
    vm.runInContext(read(filename), sandbox, { filename });
    return sandbox;
}

const REAL_CONFIG = {
    apiKey: 'AIzaTESTKEY',
    authDomain: 'demo.firebaseapp.com',
    projectId: 'demo',
    storageBucket: 'demo.appspot.com',
    messagingSenderId: '1',
    appId: '1:1:web:1'
};

function sandboxWithConfig(extra = {}) {
    return makeSandbox({
        cbtFirebaseConfig: { ...REAL_CONFIG },
        cbtAdminEmail: 'abuhafs8007@gmail.com',
        ...extra
    });
}
async function main() {
console.log('\nfirebase.js — config gating and deterministic attempt IDs');

await test('buildAttemptId is deterministic and case-insensitive on the student ID', () => {
    const { sandbox } = sandboxWithConfig();
    runInSandbox('firebase.js', sandbox);

    const first = sandbox.cbtBackend.buildAttemptId('JSS2-001', 'mathematics');
    const second = sandbox.cbtBackend.buildAttemptId('jss2-001', 'mathematics');
    const third = sandbox.cbtBackend.buildAttemptId('  JSS2-001  ', 'mathematics');

    assert.strictEqual(first, 'id:JSS2-001__mathematics');
    assert.strictEqual(first, second, 'a differently-cased ID must not create a second document');
    assert.strictEqual(first, third, 'surrounding whitespace must not create a second document');
});

await test('buildAttemptId differs per subject', () => {
    const { sandbox } = sandboxWithConfig();
    runInSandbox('firebase.js', sandbox);
    assert.notStrictEqual(
        sandbox.cbtBackend.buildAttemptId('JSS2-001', 'mathematics'),
        sandbox.cbtBackend.buildAttemptId('JSS2-001', 'english')
    );
});

await test('placeholder config values leave the backend unconfigured', () => {
    // The shipped firebase.config.js now carries the real Web app values, so the
    // gating logic is exercised here with explicit placeholders instead of relying
    // on the shipped file's contents. Placeholders must never look like a usable
    // config, and a missing/empty value must be rejected the same way.
    const { sandbox } = makeSandbox({
        cbtFirebaseConfig: {
            apiKey: 'REPLACE_WITH_YOUR_API_KEY',
            authDomain: 'REPLACE_WITH_YOUR_AUTH_DOMAIN',
            projectId: 'REPLACE_WITH_YOUR_PROJECT_ID',
            storageBucket: 'REPLACE_WITH_YOUR_STORAGE_BUCKET',
            messagingSenderId: 'REPLACE_WITH_YOUR_SENDER_ID',
            appId: 'REPLACE_WITH_YOUR_APP_ID'
        }
    });
    runInSandbox('firebase.js', sandbox);
    assert.strictEqual(sandbox.cbtBackend.configured, false, 'placeholders must not look real');
});

await test('a real-looking config is accepted', () => {
    const { sandbox } = sandboxWithConfig();
    runInSandbox('firebase.js', sandbox);
    assert.strictEqual(sandbox.cbtBackend.configured, true);
});

await test('signIn rejects a non-admin address before any network call', async () => {
    const { sandbox } = makeSandbox();
    runInSandbox('firebase.config.js', sandbox);
    runInSandbox('firebase.js', sandbox);

    assert.strictEqual(sandbox.cbtAdminEmail, 'abuhafs8007@gmail.com');
    assert.strictEqual(sandbox.cbtBackend.isAdminUser(), false, 'no session means not an admin');
    // The address check happens before the dynamic import of firebase-auth, so
    // the rejection is the admin-address error, not an import error.
    await assert.rejects(
        () => sandbox.cbtBackend.signIn('someone.else@example.com', 'password'),
        error => /restricted to the designated administrator/.test(String(error && error.message))
    );
});

console.log('\nscript.js — private data is never cached in localStorage');

await test('students, attempts and results are excluded from the local cache allow-list', () => {
    const source = read('script.js');
    const policy = source.slice(
        source.indexOf('const LOCAL_CACHE_ONLY_KEYS'),
        source.indexOf('function loadCbtData')
    );

    assert.match(policy, /LOCAL_CACHE_ONLY_KEYS = new Set\(\['subjects', 'questions', 'settings', 'removedSubjects'\]\)/);
    ['students', 'attempts', 'results'].forEach(key => {
        assert.ok(!policy.includes(`'${key}'`), `'${key}' must not be in the local-cache allow-list`);
    });
});

await test('saveCbtData refuses to write private keys to localStorage', () => {
    const source = read('script.js');
    const start = source.indexOf('const LOCAL_CACHE_ONLY_KEYS');
    const saveStart = source.indexOf('function saveCbtData', start);
    const endMarker = source.indexOf('return false;', saveStart);
    assert.ok(start > -1 && saveStart > -1 && endMarker > saveStart, 'could not locate the storage policy');
    // Trim to the end of saveCbtData's catch block, then close it explicitly.
    const policy = source.slice(start, endMarker) + 'return false;\r\n    }\r\n}\r\n';

    const { sandbox, store } = makeSandbox();
    vm.createContext(sandbox);
    sandbox.CBT_STORAGE_KEYS = {
        students: 'cbt_students',
        subjects: 'cbt_subjects',
        questions: 'cbt_questions',
        attempts: 'cbt_attempts',
        results: 'cbt_results',
        settings: 'cbt_settings',
        removedSubjects: 'cbt_removed_subjects'
    };
    vm.runInContext(policy, sandbox, { filename: 'storage-policy' });

    assert.strictEqual(sandbox.saveCbtData('students', [{ id: 'JSS2-001' }]), true);
    assert.strictEqual(sandbox.saveCbtData('attempts', [{ id: 'x' }]), true);
    assert.strictEqual(sandbox.saveCbtData('results', [{ id: 'x' }]), true);
    assert.strictEqual(store.size, 0, 'roster, attempts and results must never reach localStorage');

    assert.strictEqual(sandbox.saveCbtData('subjects', [{ id: 'mathematics' }]), true);
    assert.strictEqual(store.size, 1, 'world-readable config may still be cached');
});

await test('the roster starts empty rather than seeded from localStorage', () => {
    const source = read('script.js');
    assert.match(source, /let cbtStudents = loadCbtData\('students', \[\]\);/);
    assert.doesNotMatch(source, /loadCbtData\('students', sampleStudents\)/);
    assert.doesNotMatch(source, /^migrateLegacyScores\(\);/m);
});

await test('the exam is gated on the Firestore data load', () => {
    const source = read('script.js');
    assert.match(source, /let cbtDataReady = false;/);
    assert.match(source, /async function runStartQuiz\(\) \{/);

    const gateStart = source.indexOf('async function runStartQuiz');
    assert.ok(gateStart > -1, 'could not locate runStartQuiz');
    // Bound the slice at the end of runStartQuiz so an earlier occurrence of
    // 'const registeredStudent' elsewhere in the file cannot shorten it.
    const gateEnd = source.indexOf('async function saveCompletedAttempt');
    const gate = source.slice(gateStart, gateEnd > gateStart ? gateEnd : gateStart + 9000);
    assert.match(gate, /if \(!cbtDataReady\) \{[\s\S]{0,80}alert\(cbtDataError/);
    assert.match(source, /currentAttemptId = window\.cbtBackend\.buildAttemptId\(currentStudentId, selectedTopic\);/);
});

await test('Student ID verification performs a single scoped lookup', () => {
    const source = read('script.js');
    assert.match(source, /student = await window\.cbtBackend\.verifyStudent\(enteredId\);/);
    assert.match(source, /cbtStudents = \[student\];/, 'only the verified student is held in memory');
    assert.doesNotMatch(source, /const student = findRegisteredStudent\(enteredId\);/);
});

await test('the submitted score is written to Firestore and awaited', () => {
    const source = read('script.js');
    assert.match(source, /const resultSaved = await saveCompletedAttempt\(/);
    assert.match(source, /await queueAttemptWrite\(\{ \.\.\.scoreData/);

    // The write queue guarantees an in-flight 'In Progress' autosave can never
    // land after the final 'Completed' write and revert the attempt's status.
    assert.match(source, /let attemptWriteChain = Promise\.resolve\(\);/);
    const queue = source.slice(source.indexOf('function queueAttemptWrite'));
    assert.match(queue, /attemptWriteChain = next\.catch\(\(\) => \{ \}\);/);
});


console.log('\nfirestore.rules — least-privilege contract');

const rules = read('firestore.rules');

await test('the roster can be read by exact ID but never listed by the public', () => {
    const roster = rules.slice(rules.indexOf('match /students/{studentId}'), rules.indexOf('// --- Questions'));
    assert.match(roster, /allow get: if true;/);
    assert.match(roster, /allow list: if isAdmin\(\);/);
    assert.match(roster, /allow create, update, delete: if isAdmin\(\);/);
});

await test('attempts are admin-read-only and locked once completed', () => {
    const attempts = rules.slice(rules.indexOf('match /attempts/{attemptId}'), rules.indexOf('// --- Attempt status markers'));
    assert.match(attempts, /allow read: if isAdmin\(\);/);
    assert.match(attempts, /allow delete: if isAdmin\(\);/);
    assert.match(attempts, /!exists\(/);
    assert.match(attempts, /resource\.data\.status != 'Completed'/);
});

await test('attempt creation is bound to the deterministic document ID', () => {
    assert.match(rules, /attemptId == \('id:' \+ data\.studentId\.toUpperCase\(\) \+ '__' \+ data\.subjectId\)/);
    assert.match(rules, /data\.id == attemptId/);
});

await test('the public status marker carries no name, class or score', () => {
    const marker = rules.slice(rules.indexOf('function validStatusMarker'));
    assert.match(marker, /data\.keys\(\)\.hasOnly\(\['studentId', 'subjectId', 'status'\]\)/);
});

await test('the administrator email in the rules matches the approved address', () => {
    assert.match(rules, /request\.auth\.token\.email == 'abuhafs8007@gmail\.com'/);
    assert.match(read('firebase.config.js'), /window\.cbtAdminEmail = 'abuhafs8007@gmail\.com'/);
});

await test('no permissive catch-all rules are used', () => {
    assert.doesNotMatch(rules, /allow read, write: if true;/);
    assert.doesNotMatch(rules, /allow read, write:/);
    assert.doesNotMatch(rules, /match \/\{document=\*\*\}/);
});

console.log('\nindex.html — load order');

await test('firebase.config.js and firebase.js load before script.js and admin.js', () => {
    const html = read('index.html');
    const configAt = html.indexOf('src="firebase.config.js"');
    const moduleAt = html.indexOf('src="firebase.js"');
    const appAt = html.indexOf('src="script.js"');
    const adminAt = html.indexOf('src="admin.js"');

    assert.ok(configAt > 0 && moduleAt > 0 && appAt > 0 && adminAt > 0, 'all four scripts must be referenced');
    assert.ok(configAt < moduleAt, 'firebase.config.js must load before firebase.js');
    assert.ok(moduleAt < appAt, 'firebase.js must load before script.js');
    assert.ok(moduleAt < adminAt, 'firebase.js must load before admin.js');
    assert.match(html.slice(moduleAt - 20, moduleAt), /type="module"/);
});

console.log('\nadmin.js — hardcoded credentials are gone');

await test('no hardcoded admin username or password remains', () => {
    const admin = read('admin.js');
    assert.doesNotMatch(admin, /ADMIN_USERNAME/);
    assert.doesNotMatch(admin, /ADMIN_PASSWORD/);
    assert.doesNotMatch(admin, /1234567890/);
    assert.match(admin, /window\.cbtBackend\.signIn\(/);
    assert.match(admin, /await window\.cbtBackend\.loadAdminRecords\(\);/);
});

console.log('\nreference/ and the English project are untouched');

await test('reference/ files are unmodified', () => {
    const { execSync } = require('child_process');
    const changed = execSync('git status --porcelain -uall -- reference', { cwd: ROOT, encoding: 'utf8' }).trim();
    assert.strictEqual(changed, '', `reference/ must stay untouched, saw:\n${changed}`);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
}

main();
