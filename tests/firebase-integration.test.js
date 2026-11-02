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
const http = require('http');
const path = require('path');
const vm = require('vm');
const { chromium } = require('playwright');

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

await test('the app loads in a browser without fatal null-element runtime errors', async () => {
    const server = http.createServer((req, res) => {
        const requestPath = req.url.split('?')[0] || '/';
        const safePath = requestPath === '/' ? '/index.html' : requestPath;
        const filePath = path.join(ROOT, safePath);
        if (!filePath.startsWith(ROOT)) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }
        fs.readFile(filePath, (error, data) => {
            if (error) {
                res.writeHead(404);
                res.end('Not found');
                return;
            }
            const extension = path.extname(filePath).toLowerCase();
            const types = {
                '.html': 'text/html; charset=utf-8',
                '.js': 'application/javascript; charset=utf-8',
                '.css': 'text/css; charset=utf-8',
                '.json': 'application/json; charset=utf-8',
                '.svg': 'image/svg+xml',
                '.png': 'image/png',
                '.ico': 'image/x-icon'
            };
            res.writeHead(200, { 'Content-Type': types[extension] || 'application/octet-stream' });
            res.end(data);
        });
    });

    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('console', message => {
        if (message.type() === 'error') pageErrors.push(message.text());
    });

    try {
        await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1000);
        assert.deepStrictEqual(pageErrors, [], `browser runtime errors: ${pageErrors.join('; ')}`);
        assert.ok(await page.locator('#startScreen').isVisible(), 'student start screen should render');
        const favicon = await page.request.get(`http://127.0.0.1:${port}/favicon.svg`);
        assert.strictEqual(favicon.status(), 200, 'the favicon should be served successfully');
        assert.match(favicon.headers()['content-type'], /image\/svg\+xml/);

        const questionRenderError = await page.evaluate(() => {
            currentQuiz = [{
                q: 'سؤال اختباري',
                opts: ['أ', 'ب', 'ج', 'د'],
                ans: 0,
                shuffledOptions: ['أ', 'ب', 'ج', 'د'].map((option, originalIndex) => ({ option, originalIndex }))
            }];
            selectedAnswers = [null];
            visitedQuestions = [false];
            currentQuestion = 0;
            selectedDifficulty = 'medium';
            try {
                displayQuestion();
                return '';
            } catch (error) {
                return error.message;
            }
        });
        assert.strictEqual(questionRenderError, '', 'question rendering should not depend on the optional review button');
        assert.strictEqual(await page.locator('#questionText').textContent(), 'سؤال اختباري');
        const restartError = await page.evaluate(() => {
            try {
                restartQuiz();
                return '';
            } catch (error) {
                return error.message;
            }
        });
        assert.strictEqual(restartError, '', 'restarting should not depend on the optional review button');
    } finally {
        await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
});

await test('all six registered classes use isolated question banks and save class-specific results', async () => {
    const server = http.createServer((req, res) => {
        const requestPath = req.url.split('?')[0] || '/';
        const safePath = requestPath === '/' ? '/index.html' : requestPath;
        const filePath = path.join(ROOT, safePath);
        if (!filePath.startsWith(ROOT)) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }
        fs.readFile(filePath, (error, data) => {
            if (error) {
                res.writeHead(404);
                res.end('Not found');
                return;
            }
            const extension = path.extname(filePath).toLowerCase();
            const types = {
                '.html': 'text/html; charset=utf-8',
                '.js': 'application/javascript; charset=utf-8',
                '.css': 'text/css; charset=utf-8',
                '.svg': 'image/svg+xml'
            };
            res.writeHead(200, { 'Content-Type': types[extension] || 'application/octet-stream' });
            res.end(data);
        });
    });

    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('console', message => {
        if (message.type() === 'error') pageErrors.push(message.text());
    });
    page.on('dialog', dialog => dialog.accept());

    try {
        await page.route('**/firebase.js', route => route.fulfill({
            status: 200,
            contentType: 'text/javascript',
            body: 'export {};'
        }));
        await page.addInitScript(() => {
            const classLevels = {
                'JSS 1': 'easy',
                'JSS 2': 'medium',
                'JSS 3': 'hard',
                'SS 1': 'ss1',
                'SS 2': 'ss2',
                'SS 3': 'ss3'
            };
            const classes = Object.keys(classLevels);
            const students = Object.fromEntries(classes.map((className, index) => {
                const studentId = `CLASS-TEST-${index + 1}`;
                return [studentId, {
                    id: studentId,
                    studentId,
                    name: `Class Test ${index + 1}`,
                    className
                }];
            }));
            const questions = Object.fromEntries(Object.entries(classLevels).map(([className, level]) => [
                level,
                Array.from({ length: 5 }, (_, index) => ({
                    q: `${className} bank question ${index + 1}`,
                    opts: ['A', 'B', 'C', 'D'],
                    ans: 0
                }))
            ]));
            const attempts = {};
            const statuses = {};
            const buildAttemptId = (studentId, subjectId) =>
                `id:${String(studentId).trim().toUpperCase()}__${String(subjectId).trim()}`;
            window.__classTestAttempts = attempts;
            window.cbtBackend = {
                state: 'ready',
                stateError: '',
                onAuthChange: () => {},
                isAdminUser: () => false,
                whenReady: async () => true,
                loadExamConfig: async () => ({
                    settings: {
                        defaultDuration: 30,
                        numberOfQuestions: 5,
                        passingScore: 50,
                        allowResults: true,
                        examInstructions: 'اختبار آلي'
                    },
                    subjects: [{
                        id: 'class_test',
                        name: 'مادة الاختبار',
                        isEnabled: true,
                        durationMinutes: 30,
                        timers: Object.fromEntries(classes.map((className, index) => [className, 11 + index])),
                        instructions: 'اختبار آلي'
                    }],
                    questions: { class_test: questions },
                    removedSubjects: []
                }),
                verifyStudent: async studentId => students[String(studentId).trim()] || null,
                buildAttemptId,
                readAttemptStatus: async (studentId, subjectId) =>
                    statuses[buildAttemptId(studentId, subjectId)] || null,
                writeAttempt: async attempt => {
                    const attemptId = buildAttemptId(attempt.studentId, attempt.subjectId);
                    if (statuses[attemptId]?.status === 'Completed') {
                        throw new Error('Completed attempts cannot be changed.');
                    }
                    attempts[attemptId] = { ...attempt, id: attemptId };
                    statuses[attemptId] = {
                        studentId: attempt.studentId,
                        subjectId: attempt.subjectId,
                        status: attempt.status
                    };
                    return attemptId;
                },
                loadAdminRecords: async () => ({
                    students: Object.values(students),
                    attempts: Object.values(attempts),
                    results: Object.values(attempts)
                })
            };
        });
        await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => window.cbtBackend?.state === 'ready' && cbtDataReady);
        await page.locator('#confirmGuidelines').click();

        const classNames = ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'];
        const adminSupport = await page.evaluate(() => ({
            studentClass: normalizeAdminClass('ss3'),
            studentCsv: buildStudentImportPreview('Student ID,Student Name,Class\nCSV-SS3,Senior Student,ss3'),
            questionCsv: buildQuestionImportPreview('Question,Option A,Option B,Option C,Option D,Correct Answer,Subject,Class\nسؤال SS,أ,ب,ج,د,A,مادة الاختبار,SS 1'),
            studentForm: renderStudents(),
            questionForm: renderQuestions(),
            subjectForm: renderSubjects()
        }));
        assert.strictEqual(adminSupport.studentClass, 'SS 3');
        assert.strictEqual(adminSupport.studentCsv.valid, true);
        assert.strictEqual(adminSupport.studentCsv.rows[0].className, 'SS 3');
        assert.strictEqual(adminSupport.questionCsv.valid, true);
        assert.strictEqual(adminSupport.questionCsv.rows[0].difficulty, 'ss1');
        classNames.forEach(className => {
            assert.ok(adminSupport.studentForm.includes(`value="${className}">${className}</option>`), `${className} must be available for student management`);
            assert.ok(adminSupport.questionForm.includes(`>${className}</option>`), `${className} must be available for question management`);
            assert.ok(adminSupport.subjectForm.includes(`<label>${className}`), `${className} must have an editable subject timer`);
        });

        const classButtons = page.locator('.class-selection-btn');
        assert.strictEqual(await classButtons.count(), 6, 'the student interface must show exactly six class choices');
        assert.deepStrictEqual(await classButtons.allTextContents(), classNames);

        for (let index = 0; index < classNames.length; index += 1) {
            const className = classNames[index];
            const studentId = `CLASS-TEST-${index + 1}`;
            await page.locator('#studentId').fill(studentId);
            await page.locator('#verifyStudentBtn').click();
            await page.locator('#verifiedStudentSummary').waitFor({ state: 'visible' });

            for (const option of classNames) {
                const button = page.locator(`.class-selection-btn[data-class="${option}"]`);
                assert.strictEqual(await button.isDisabled(), option !== className, `${className} must be the only enabled class`);
                assert.strictEqual(await button.getAttribute('aria-pressed'), String(option === className));
                const box = await button.boundingBox();
                assert.ok(box && box.x >= 0 && box.x + box.width <= 390, `${option} button must fit the mobile viewport`);
            }
            assert.match(await page.locator('#registeredClassMessage').textContent(), new RegExp(className.replace(' ', '\\s+')));

            const duration = await page.evaluate(() => getClassSubjectTimer('class_test', currentStudentClass));
            assert.strictEqual(duration, 11 + index, `${className} must use its own subject timer`);

            if (index === 0) {
                await page.evaluate(() => {
                    currentStudentClass = 'SS 1';
                    selectedDifficulty = 'ss1';
                });
            }
            await page.locator('.topic-btn[data-topic="class_test"]').click();
            await page.locator('#numQuestions').fill('5');
            await page.locator('#startbtn').click();
            await page.locator('#quizScreen.active').waitFor({ state: 'visible' });
            assert.match(await page.locator('#questionText').textContent(), new RegExp(className.replace(' ', '\\s+')));
            assert.strictEqual(await page.locator('#selectedClassDisplay').textContent(), className);
            assert.strictEqual(await page.evaluate(() => currentStudentClass), className, 'the registered record must override browser-side class state');

            await page.locator('#options input[type="radio"]').first().check();
            await page.locator('#nextBtn').click();
            await page.locator('#prevBtn').click();
            assert.strictEqual(await page.locator('#options input[type="radio"]:checked').count(), 1, 'answers must persist while navigating');
            await page.locator('#quitBtn').click();
            await page.locator('#resultsScreen.active').waitFor({ state: 'visible' });
            await page.waitForFunction(() => document.getElementById('saveStatus').textContent.includes('تم حفظ النتيجة'));

            const saved = await page.evaluate(async ({ studentId, className }) => {
                const records = await window.cbtBackend.loadAdminRecords();
                window.cbtApp.results = records.results;
                return {
                    resultClass: document.getElementById('classResult').textContent,
                    attempt: records.attempts.find(entry => entry.studentId === studentId),
                    questionCount: document.getElementById('totalQuestions').textContent,
                    resultMarkup: renderResults(),
                    expectedClass: className
                };
            }, { studentId, className });
            assert.strictEqual(saved.resultClass, className);
            assert.strictEqual(saved.attempt.className, className);
            assert.strictEqual(saved.attempt.durationMinutes, duration, `${className} result must retain its configured duration`);
            assert.strictEqual(saved.attempt.status, 'Completed');
            assert.strictEqual(saved.attempt.totalQuestions, 5);
            assert.strictEqual(saved.questionCount, '5');
            assert.ok(saved.resultMarkup.includes(`<td>${className}</td>`), `admin results must display ${className}`);

            if (index < classNames.length - 1) {
                await page.evaluate(() => restartQuiz());
            }
        }
        assert.deepStrictEqual(pageErrors, [], `browser runtime errors: ${pageErrors.join('; ')}`);
        const savedClasses = await page.evaluate(() =>
            Object.values(window.__classTestAttempts).map(attempt => attempt.className).sort()
        );
        assert.deepStrictEqual(savedClasses, classNames.slice().sort(), 'the result records must distinguish all six classes');
    } finally {
        await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
});

console.log('\nscript.js — private data is never cached in localStorage');

await test('Firebase web configuration targets the confirmed Arabic project', () => {
    const config = read('firebase.config.js');
    assert.match(config, /projectId:\s*"arabic-cbt-exam-platform"/);
    assert.match(config, /appId:\s*"1:329961434170:web:e4b9e9a54530ef2ce71903"/);
});

await test('optional review controls are never dereferenced without a presence check', () => {
    const source = read('script.js');
    assert.doesNotMatch(source, /document\.getElementById\('toggleReviewBtn'\)\.(?:disabled|textContent)/);
});

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
    assert.match(source, /cbtStudents = \[\{ \.\.\.student, className: registeredClass \}\];/, 'only the verified student is held in memory with its normalized registered class');
    assert.doesNotMatch(source, /const student = findRegisteredStudent\(enteredId\);/);
});

await test('the six class labels map to distinct JSS and SS question-bank arrays', () => {
    const app = read('script.js');
    const backend = read('firebase.js');
    const admin = read('admin.js');
    const html = read('index.html');
    const classButtons = [...html.matchAll(/class="class-selection-btn"[^>]*data-class="([^"]+)"/g)]
        .map(match => match[1]);

    assert.deepStrictEqual(classButtons, ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3']);
    ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'].forEach(className => {
        assert.ok(app.includes(`'${className}':`), `${className} must map to a distinct question-bank key`);
    });
    assert.match(backend, /QUESTION_BANK_LEVELS = \['easy', 'medium', 'hard', 'ss1', 'ss2', 'ss3'\]/);
    assert.match(admin, /adminClassOptions = \['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'\]/);
    assert.match(admin, /'SS 1': 'ss1'/);
    assert.match(admin, /'SS 2': 'ss2'/);
    assert.match(admin, /'SS 3': 'ss3'/);
});

await test('student class access is derived from the verified record and Firestore enforces it', () => {
    const app = read('script.js');
    const rulesSource = read('firestore.rules');
    assert.match(app, /currentStudentClass = normalizeClassName\(registeredStudent\.className\)/);
    assert.match(app, /const registeredClass = normalizeClassName\(student\.className\)/);
    assert.match(app, /normalizeClassName\(btn\.dataset\.class\) !== registeredClass/);
    assert.match(rulesSource, /classMatchesStudent\(data\.studentId, data\.className\)/);
    assert.match(rulesSource, /data\.className == data\.class/);
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
    assert.match(rules, /attemptId == \('id:' \+ data\.studentId \+ '__' \+ data\.subjectId\)/);
    assert.match(rules, /data\.id == attemptId/);
    assert.match(read('firebase.js'), /const studentId = String\(attempt\.studentId \|\| ''\)\.trim\(\)\.toUpperCase\(\);/);
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
