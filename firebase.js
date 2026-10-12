/**
 * Firebase integration + the only data-access adapter used by this app.
 *
 * Loaded as an ES module from the gstatic CDN, so there is NO build step and
 * the project stays deployable as plain static files (GitHub Pages / Firebase
 * Hosting / any static host). This mirrors the approach already used in
 * `reference/`, which the project owner approved.
 *
 * Everything the rest of the application needs is exposed on `window.cbtBackend`
 * as a promise-based API. No other file imports Firestore directly, so the
 * rules contract lives in exactly one place.
 *
 * DOCUMENTED SECURITY LIMITATIONS (accepted; not fixable on Firebase Spark):
 * 1. Students are UNAUTHENTICATED. They prove nothing but a Student ID string,
 *    so rules cannot prove WHO submitted an attempt. Anyone who knows another
 *    student's ID can submit an attempt under that ID.
 * 2. Scoring happens in the browser and is NOT tamper-proof. A student can edit
 *    the score they write. Rules only constrain the document shape and lock an
 *    attempt once its status is 'Completed'.
 * 3. Correct answers must reach the browser to render the exam, so they are
 *    discoverable by students (DevTools / network panel). Unavoidable for a
 *    client-rendered exam without Cloud Functions.
 * 4. `students/{id}` allows a public `get`, so an attacker may probe individual
 *    IDs one at a time. `list` is admin-only, so the roster cannot be dumped or
 *    enumerated in bulk. Rules cannot rate-limit; use Firebase App Check if
 *    probing becomes a problem.
 *
 * What the rules DO guarantee: the roster cannot be listed publicly, results and
 * attempts are readable only by the administrator, completed attempts cannot be
 * edited by students, and every write is denied by default.
 */

const BACKEND_STATE = {
    LOADING: 'loading',
    READY: 'ready',
    UNCONFIGURED: 'unconfigured',
    ERROR: 'error'
};

/** Collections used by the rules. Keep in sync with firestore.rules. */
const COLLECTIONS = {
    students: 'students',
    subjects: 'subjects',
    questions: 'questions',
    settings: 'settings',
    attempts: 'attempts',
    attemptStatus: 'attemptStatus',
    meta: 'meta'
};

const SETTINGS_DOC = 'config';
const REMOVED_SUBJECTS_DOC = 'removedSubjects';
const ADMIN_EMAIL_FALLBACK = 'abuhafs8007@gmail.com';
const SDK = 'https://www.gstatic.com/firebasejs/9.22.0';

let firebaseApp = null;
let auth = null;
let db = null;

let state = BACKEND_STATE.LOADING;
let stateError = '';
let currentUser = null;
let authListeners = [];

/**
 * Deterministic attempt document ID: `id:<studentId>__<subjectId>`.
 *
 * Determinism is what lets the rules pin the document ID to the student and
 * subject, which makes a second "create" for the same student+subject land on
 * the SAME document and be evaluated as an update (and therefore blocked once
 * the attempt is Completed). Random IDs would allow an unlimited number of
 * attempt documents per student.
 */
function buildAttemptId(studentId, subjectId) {
    const student = String(studentId || '').trim().toUpperCase();
    const subject = String(subjectId || '').trim();
    return `id:${student}__${subject}`;
}

function isPlaceholder(value) {
    const text = String(value || '').trim();
    return !text || text.startsWith('REPLACE_WITH_');
}

/** True only when every Firebase config value is a real, non-placeholder one. */
function hasUsableConfig() {
    const config = window.cbtFirebaseConfig;
    if (!config || typeof config !== 'object') return false;
    return ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
        .every(key => !isPlaceholder(config[key]));
}

/** Turn a Firebase error code into a message the operator can act on. */
function describeFirebaseError(error, context) {
    const code = error && error.code ? String(error.code) : '';
    const where = context ? ` (${context})` : '';
    if (code === 'permission-denied') {
        return `Access denied by the Firestore security rules${where}. Sign in as the administrator, or check firestore.rules.`;
    }
    if (code === 'unavailable' || code === 'failed-precondition') {
        return `Firestore is unreachable${where}. This platform requires an internet connection; offline submissions are not allowed.`;
    }
    if (code === 'unauthenticated') {
        return `You must be signed in${where}.`;
    }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' ||
        code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        return 'Incorrect administrator email or password.';
    }
    if (code === 'auth/too-many-requests') {
        return 'Too many failed sign-in attempts. Wait a moment before trying again.';
    }
    if (code === 'auth/network-request-failed') {
        return 'Could not reach Firebase Authentication. Check your internet connection.';
    }
    return `${(error && error.message) || 'Unknown error'}${where}`;
}

/** Rough guard: a single Firestore document must stay under 1 MiB. */
function assertDocumentSize(label, payload) {
    const bytes = new Blob([JSON.stringify(payload)]).size;
    if (bytes > 950000) {
        throw new Error(`${label} is too large for one Firestore document (${bytes} bytes). Split the question bank across subjects.`);
    }
    return bytes;
}

function normalizeStudentRecord(id, data) {
    const studentId = String(data.studentId || id || '').trim();
    return {
        id: String(data.id || studentId || id).trim(),
        name: String(data.name || '').trim(),
        studentId,
        className: String(data.className || '').trim()
    };
}

function normalizeSubjectRecord(id, data) {
    return {
        ...data,
        id: String(data.id || id).trim(),
        name: String(data.name || id).trim()
    };
}

function adminEmail() {
    return String(window.cbtAdminEmail || ADMIN_EMAIL_FALLBACK).trim().toLowerCase();
}

function firestoreSdk() {
    return import(`${SDK}/firebase-firestore.js`);
}

function authSdk() {
    return import(`${SDK}/firebase-auth.js`);
}

function requireDb() {
    if (state !== BACKEND_STATE.READY || !db) {
        throw new Error(stateError || 'Firestore is not ready.');
    }
    return db;
}

async function init() {
    if (!hasUsableConfig()) {
        state = BACKEND_STATE.UNCONFIGURED;
        stateError = 'Firebase is not configured yet. Fill in firebase.config.js with the Web app values for the Arabic CBT Firebase project.';
        console.warn('[cbtBackend] ' + stateError);
        return;
    }

    if (!navigator.onLine) {
        state = BACKEND_STATE.ERROR;
        stateError = 'No internet connection. This platform cannot load exam data or submit results offline.';
        return;
    }

    try {
        const [appSdk, authModule, firestoreModule] = await Promise.all([
            import(`${SDK}/firebase-app.js`),
            import(`${SDK}/firebase-auth.js`),
            import(`${SDK}/firebase-firestore.js`)
        ]);

        firebaseApp = appSdk.initializeApp(window.cbtFirebaseConfig, 'cbt-arabic');
        auth = authModule.getAuth(firebaseApp);
        // Deliberately NOT enabling Firestore's local persistence: it would let
        // Firestore queue and later replay writes while offline, which would
        // amount to an offline submission. Writes must fail fast instead.
        db = firestoreModule.getFirestore(firebaseApp);

        auth.onAuthStateChanged(user => {
            currentUser = user || null;
            authListeners.forEach(listener => {
                try {
                    listener(currentUser, adminEmail());
                } catch (error) {
                    console.error('[cbtBackend] auth listener failed', error);
                }
            });
        });

        state = BACKEND_STATE.READY;
    } catch (error) {
        state = BACKEND_STATE.ERROR;
        stateError = describeFirebaseError(error, 'Firebase initialization');
        console.error('[cbtBackend] initialization failed', error);
    }
}


window.cbtBackend = {
    COLLECTIONS,
    BACKEND_STATE,
    buildAttemptId,

    /** Resolves once Firebase has finished initializing. Never rejects. */
    ready: Promise.resolve().then(init),

    get state() { return state; },
    get stateError() { return stateError; },
    get configured() { return hasUsableConfig(); },
    get db() { return db; },
    get currentUser() { return currentUser; },
    get adminEmail() { return adminEmail(); },

    /** Blocks until init settled. Returns true only when Firestore is usable. */
    async whenReady() {
        await this.ready;
        return state === BACKEND_STATE.READY;
    },

    /** Resolves to a status object the UI can render. */
    async status() {
        await this.ready;
        return { state, error: stateError, online: navigator.onLine };
    },

    // --- Authentication -----------------------------------------------------

    onAuthChange(listener) {
        if (typeof listener !== 'function') return () => { };
        authListeners.push(listener);
        return () => {
            authListeners = authListeners.filter(entry => entry !== listener);
        };
    },

    isAdminUser() {
        if (!currentUser || !currentUser.email) return false;
        return String(currentUser.email).trim().toLowerCase() === adminEmail();
    },

    /**
     * Sign in with Firebase Email/Password, then enforce the approved
     * administrator address. A correct password for ANY other account is
     * refused and that session is signed out immediately.
     */
    async signIn(email, password) {
        const entered = String(email || '').trim();
        // Check the address FIRST: reject before loading the auth SDK or making
        // any network request.
        if (entered.toLowerCase() !== adminEmail()) {
            throw new Error('This portal is restricted to the designated administrator account.');
        }
        const { signInWithEmailAndPassword } = await authSdk();
        if (!auth) throw new Error(stateError || 'Firebase Authentication is not ready.');
        try {
            const credential = await signInWithEmailAndPassword(auth, entered, String(password || ''));
            // Defence in depth: the rules enforce the email too, but verify the
            // signed-in identity here as well and drop any non-admin session.
            if (String(credential.user.email || '').trim().toLowerCase() !== adminEmail()) {
                await this.signOut();
                throw new Error('This portal is restricted to the designated administrator account.');
            }
            return credential.user;
        } catch (error) {
            throw new Error(describeFirebaseError(error, 'sign in'));
        }
    },

    async signOut() {
        const { signOut } = await authSdk();
        if (!auth) return;
        await signOut(auth).catch(() => { });
    },

    // --- Low-level Firestore helpers (kept private by convention) -----------

    async readDoc(path) {
        const { doc, getDoc } = await firestoreSdk();
        return getDoc(doc(db, path));
    },

    async writeDoc(path, data, merge = false) {
        const { doc, setDoc } = await firestoreSdk();
        return setDoc(doc(db, path), data, { merge });
    },

    async deleteDoc(path) {
        const { doc, deleteDoc } = await firestoreSdk();
        return deleteDoc(doc(db, path));
    },

    async listDocs(collectionPath) {
        const { collection, getDocs } = await firestoreSdk();
        return getDocs(collection(db, collectionPath));
    },

    async writeBatch(writes) {
        const { doc, writeBatch } = await firestoreSdk();
        const batch = writeBatch(db);
        writes.forEach(write => {
            const reference = doc(db, write.path);
            if (write.type === 'delete') batch.delete(reference);
            else batch.set(reference, write.data, { merge: Boolean(write.merge) });
        });
        return batch.commit();
    },

    // --- Public (student-facing) reads --------------------------------------

    /**
     * Loads the exam configuration a student needs: settings, subjects, the
     * question bank and the removed-subject list. All four are world-readable
     * by design (the exam cannot render otherwise).
     */
    async loadExamConfig() {
        requireDb();

        const [settingsSnapshot, subjectsSnapshot, questionsSnapshot, removedSnapshot] = await Promise.all([
            this.readDoc(`${COLLECTIONS.settings}/${SETTINGS_DOC}`),
            this.listDocs(COLLECTIONS.subjects),
            this.listDocs(COLLECTIONS.questions),
            this.readDoc(`${COLLECTIONS.meta}/${REMOVED_SUBJECTS_DOC}`)
        ]);

        const subjects = [];
        subjectsSnapshot.forEach(entry => {
            subjects.push(normalizeSubjectRecord(entry.id, entry.data()));
        });

        const questions = {};
        questionsSnapshot.forEach(entry => {
            const data = entry.data() || {};
            const bank = {};
            ['easy', 'medium', 'hard'].forEach(level => {
                bank[level] = Array.isArray(data[level]) ? data[level] : [];
            });
            questions[entry.id] = bank;
        });

        const removedSubjects = removedSnapshot.exists() && Array.isArray(removedSnapshot.data().ids)
            ? removedSnapshot.data().ids
            : [];

        return {
            settings: settingsSnapshot.exists() ? settingsSnapshot.data() : {},
            subjects,
            questions,
            removedSubjects
        };
    },

    /**
     * Narrowly scoped Student ID verification.
     *
     * Performs a single `get` on `students/{studentId}`. It never queries or
     * lists the roster, so a student can confirm only the ID they already typed
     * and cannot enumerate anyone else's. The rules allow exactly this
     * operation while denying `list`.
     *
     * Returns the student record, or null when the ID is unknown.
     */
    async verifyStudent(studentId) {
        requireDb();
        const id = String(studentId || '').trim();
        if (!id) return null;
        const snapshot = await this.readDoc(`${COLLECTIONS.students}/${id}`);
        if (!snapshot.exists()) return null;
        return normalizeStudentRecord(snapshot.id, snapshot.data());
    },

    // --- Administrator-only reads -------------------------------------------

    /**
     * Loads the full roster, every attempt and every result.
     * Rules restrict `list` on students and all reads on attempts to the
     * administrator, so this rejects for a student.
     */
    async loadAdminRecords() {
        requireDb();
        if (!this.isAdminUser()) {
            throw new Error('Administrator access is required to read the student roster and results.');
        }

        const [studentsSnapshot, attemptsSnapshot] = await Promise.all([
            this.listDocs(COLLECTIONS.students),
            this.listDocs(COLLECTIONS.attempts)
        ]);

        const students = [];
        studentsSnapshot.forEach(entry => {
            students.push(normalizeStudentRecord(entry.id, entry.data()));
        });

        const attempts = [];
        attemptsSnapshot.forEach(entry => {
            const data = entry.data() || {};
            attempts.push({ ...data, id: String(data.id || entry.id) });
        });

        return { students, attempts, results: attempts.slice() };
    },

    // --- Writes (administrator) ---------------------------------------------

    async saveSettings(settings) {
        requireDb();
        await this.writeDoc(`${COLLECTIONS.settings}/${SETTINGS_DOC}`, settings);
    },

    async saveSubjects(subjects) {
        requireDb();
        const writes = (subjects || []).filter(subject => subject && subject.id).map(subject => ({
            type: 'set',
            path: `${COLLECTIONS.subjects}/${subject.id}`,
            data: subject
        }));
        if (writes.length) await this.writeBatch(writes);
    },

    async saveRemovedSubjects(ids) {
        requireDb();
        await this.writeDoc(`${COLLECTIONS.meta}/${REMOVED_SUBJECTS_DOC}`, { ids: ids || [] });
    },

    /** Writes one question-bank document per subject. */
    async saveQuestions(questions) {
        requireDb();
        const writes = [];
        Object.entries(questions || {}).forEach(([subjectId, levels]) => {
            if (!subjectId) return;
            const payload = { easy: [], medium: [], hard: [] };
            ['easy', 'medium', 'hard'].forEach(level => {
                payload[level] = Array.isArray(levels && levels[level]) ? levels[level] : [];
            });
            assertDocumentSize(`Question bank for ${subjectId}`, payload);
            writes.push({ type: 'set', path: `${COLLECTIONS.questions}/${subjectId}`, data: payload });
        });
        if (writes.length) await this.writeBatch(writes);
    },

    async deleteQuestions(subjectIds) {
        requireDb();
        const ids = (subjectIds || []).filter(Boolean);
        if (!ids.length) return;
        await this.writeBatch(ids.map(id => ({ type: 'delete', path: `${COLLECTIONS.questions}/${id}` })));
    },

    /**
     * Replaces the whole roster. Document IDs are the Student IDs, which is what
     * makes single-ID verification possible and keeps IDs unique.
     */
    async saveStudents(students) {
        requireDb();
        const existing = await this.listDocs(COLLECTIONS.students);
        const wanted = new Map();
        (students || []).forEach(student => {
            const id = String(student.studentId || student.id || '').trim();
            if (id) wanted.set(id, student);
        });

        const writes = [];
        existing.forEach(entry => {
            if (!wanted.has(entry.id)) {
                writes.push({ type: 'delete', path: `${COLLECTIONS.students}/${entry.id}` });
            }
        });
        wanted.forEach((student, id) => {
            writes.push({
                type: 'set',
                path: `${COLLECTIONS.students}/${id}`,
                data: {
                    id,
                    name: String(student.name || '').trim(),
                    studentId: id,
                    className: String(student.className || '').trim()
                }
            });
        });
        if (wanted.size) await this.writeBatch(writes);
    },

    /**
     * Seeds the roster from the built-in sample list, but only when Firestore is
     * genuinely empty. Safe to call repeatedly; returns true when it seeded.
     */
    async seedRosterIfEmpty(seedStudents) {
        requireDb();
        if (!this.isAdminUser()) return false;
        const existing = await this.listDocs(COLLECTIONS.students);
        if (!existing.empty) return false;
        await this.saveStudents(seedStudents || []);
        return true;
    },

    // --- Writes (students) --------------------------------------------------

    /**
     * Persists an attempt under its deterministic ID.
     * `merge` so an in-progress autosave does not wipe dateStarted.
     */
    async writeAttempt(attempt) {
        requireDb();
        const studentId = String(attempt.studentId || '').trim();
        const subjectId = String(attempt.subjectId || '').trim();
        if (!studentId || !subjectId) {
            throw new Error('An attempt is missing its Student ID or subject.');
        }
        const attemptId = buildAttemptId(studentId, subjectId);
        await this.writeDoc(`${COLLECTIONS.attempts}/${attemptId}`, { ...attempt, id: attemptId }, true);
        // Mirror the minimal status marker. It is the only thing a student is
        // ever allowed to read back, and it carries no name, class or score.
        await this.writeDoc(`${COLLECTIONS.attemptStatus}/${attemptId}`, {
            studentId,
            subjectId,
            status: String(attempt.status || 'In Progress')
        });
        return attemptId;
    },

    /**
     * Reads the minimal public status marker for one student+subject.
     * Returns null when there is no attempt. Safe to call before sign-in: the
     * rules allow a single `get` here while denying `list`.
     */
    async readAttemptStatus(studentId, subjectId) {
        requireDb();
        const id = String(studentId || '').trim();
        const subject = String(subjectId || '').trim();
        if (!id || !subject) return null;
        const snapshot = await this.readDoc(`${COLLECTIONS.attemptStatus}/${buildAttemptId(id, subject)}`);
        return snapshot.exists() ? snapshot.data() : null;
    },

    async deleteAttempt(attemptId) {
        requireDb();
        await this.deleteDoc(`${COLLECTIONS.attempts}/${attemptId}`);
        await this.deleteDoc(`${COLLECTIONS.attemptStatus}/${attemptId}`);
    }
};

