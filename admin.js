// ---------------------------------------------------------------------------
// Administrator authentication
// ---------------------------------------------------------------------------
// This portal no longer uses hardcoded frontend credentials. Sign-in goes
// through Firebase Email/Password (firebase.js -> window.cbtBackend.signIn),
// which additionally refuses any account whose email is not the approved
// administrator address. The authoritative enforcement lives in
// firestore.rules (`request.auth.token.email`), so hiding this check in the
// client is only defence in depth.
const adminRoot = document.getElementById('adminPortal');
const studentApp = document.querySelector('.container');
const adminEntryButton = document.getElementById('openAdminBtn');

let adminLoggedIn = false;
let adminSection = 'Dashboard';
let studentSearch = '';
let questionSearch = '';
let questionSubjectFilter = '';
let resultFilters = { search: '', student: '', className: '', subject: '', status: '' };
let adminStorageError = false;
let adminImportState = null;

const adminSections = ['Dashboard', 'Students', 'Questions', 'Subjects / Exams', 'Attempts', 'Results', 'Settings'];
const adminClassOptions = ['JSS 1', 'JSS 2', 'JSS 3'];

function normalizeAdminText(value) {
    return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function normalizeAdminClass(className) {
    const canonical = normalizeAdminText(className).replace(/\s+/g, ' ');
    const upper = canonical.toUpperCase();
    if (upper === 'JSS1' || upper === 'JSS 1') return 'JSS 1';
    if (upper === 'JSS2' || upper === 'JSS 2') return 'JSS 2';
    if (upper === 'JSS3' || upper === 'JSS 3') return 'JSS 3';
    return canonical;
}

function normalizeAdminSubject(value) {
    const raw = normalizeAdminText(value).toLowerCase();
    return raw.replace(/[\u0640\u0610-\u064A\u0660-\u0669]/g, character => character);
}

function parseAdminCsv(text) {
    const rows = [];
    let current = '';
    let currentRow = [];
    let inQuotes = false;

    for (let index = 0; index < text.length; index++) {
        const character = text[index];
        const next = text[index + 1];

        if (character === '"') {
            if (inQuotes && next === '"') {
                current += '"';
                index += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (character === ',' && !inQuotes) {
            currentRow.push(current);
            current = '';
            continue;
        }

        if ((character === '\n' || character === '\r') && !inQuotes) {
            if (character === '\r' && next === '\n') {
                index += 1;
            }
            currentRow.push(current);
            if (currentRow.some(value => String(value).trim() !== '')) {
                rows.push(currentRow);
            }
            currentRow = [];
            current = '';
            continue;
        }

        current += character;
    }

    if (current || currentRow.length) {
        currentRow.push(current);
        if (currentRow.some(value => String(value).trim() !== '')) {
            rows.push(currentRow);
        }
    }

    return rows;
}

function downloadCsvFile(filename, rows) {
    const csvOutput = rows.map(row => row.map(cell => {
        const value = String(cell ?? '');
        if (/[",\n\r]/.test(value)) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }).join(',')).join('\n');

    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function generateQuestionCsvTemplate() {
    const templateRows = [
        ['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Subject', 'Class'],
        ['ما هي عاصمة نيجيريا؟', 'لاغوس', 'أبوجا', 'كانو', 'إبادان', 'B', 'الجغرافيا', 'JSS 1']
    ];
    downloadCsvFile('question-template.csv', templateRows);
}

function generateStudentCsvTemplate() {
    const templateRows = [
        ['Student ID', 'Student Name', 'Class'],
        ['DA001', 'Ahmad Ishola', 'JSS 1']
    ];
    downloadCsvFile('student-template.csv', templateRows);
}

function escapeAdminText(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function allQuestions() {
    return Object.entries(window.cbtApp.questions).flatMap(([subjectId, levels]) =>
        Object.entries(levels || {}).flatMap(([difficulty, questions]) =>
            (Array.isArray(questions) ? questions : []).map((question, index) => ({
                subjectId,
                difficulty,
                index,
                question
            }))
        )
    );
}

function hasDuplicateStudentId(studentId, ignoredRecordId = '') {
    const normalizedId = String(studentId || '').trim().toUpperCase();
    return window.cbtApp.students.some(student =>
        String(student.studentId || student.id || '').trim().toUpperCase() === normalizedId &&
        String(student.id) !== ignoredRecordId
    );
}

/**
 * Persists an admin change to Firestore (the authoritative store) and refreshes
 * the local cache. Returns a Promise<boolean> so callers can await it.
 *
 * The in-memory arrays in script.js are updated synchronously by the callers, so
 * the UI re-renders immediately; this function is what makes the change durable
 * and visible to every other client.
 */
async function saveAdminData(key) {
    if (!window.cbtBackend) {
        adminStorageError = true;
        showAdminNotice('Firebase did not load. Changes cannot be saved.', true);
        return false;
    }

    try {
        switch (key) {
            case 'students':
                await window.cbtBackend.saveStudents(window.cbtApp.students);
                break;
            case 'subjects':
                await window.cbtBackend.saveSubjects(window.cbtApp.subjects);
                break;
            case 'settings':
                await window.cbtBackend.saveSettings(window.cbtApp.settings);
                break;
            case 'questions':
                await window.cbtBackend.saveQuestions(window.cbtApp.questions);
                break;
            case 'removedSubjects':
                await window.cbtBackend.saveRemovedSubjects(window.cbtApp.removedSubjects);
                await window.cbtBackend.deleteQuestions(window.cbtApp.removedSubjects);
                break;
            case 'attempts':
            case 'results':
                // Attempts and results are student-owned documents. The admin may
                // correct them, but their ID and identity fields are pinned by the
                // rules, so rewrite each changed document in place.
                await persistAdminAttempts();
                break;
            default:
                break;
        }
        adminStorageError = false;
        return true;
    } catch (error) {
        console.error(`[admin] could not save ${key}`, error);
        adminStorageError = true;
        showAdminNotice(
            (error && error.message) || 'Could not save changes to Firestore. Check your connection and try again.',
            true
        );
        return false;
    }
}

/**
 * Writes every in-memory attempt back to Firestore.
 *
 * The rules pin an attempt's studentId/subjectId/id, so only the mutable
 * scoring/status fields are rewritten; the document keeps its identity.
 */
async function persistAdminAttempts() {
    const attempts = window.cbtApp.attempts || [];
    for (const attempt of attempts) {
        await window.cbtBackend.writeAttempt(attempt);
    }
}

/**
 * Creates or edits a student, then persists the roster.
 *
 * DOCUMENTED LIMITATION: renaming a Student ID changes the deterministic attempt
 * document IDs (they are derived from the ID). Firestore rules pin an attempt's
 * studentId/subjectId, so an existing attempt CANNOT be re-pointed at the new ID
 * in place. We therefore write the renamed attempt under its NEW ID and delete
 * the old document, which keeps history intact without breaking the rules.
 */
async function handleStudentForm(values) {
    const originalId = String(values.get('originalId') || '');
    const previousStudent = window.cbtApp.students.find(entry => String(entry.id) === originalId);
    const student = {
        id: originalId || String(values.get('studentId')).trim(),
        name: String(values.get('name')).trim(),
        studentId: String(values.get('studentId')).trim(),
        className: String(values.get('className')).trim()
    };
    if (!student.id || !student.name || !student.studentId || !student.className) return;
    if (hasDuplicateStudentId(student.studentId, originalId)) {
        return showAdminNotice('Student ID already exists.', true);
    }

    const renamed =
        previousStudent &&
        String(previousStudent.studentId || previousStudent.id).trim().toUpperCase() !==
        student.studentId.trim().toUpperCase();

    if (renamed) {
        // Re-key every existing attempt to the new Student ID BEFORE saving.
        const previousId = String(previousStudent.studentId || previousStudent.id).trim();
        const previousKey = `id:${previousId.toLowerCase()}`;
        const updatedKey = `id:${student.studentId.toLowerCase()}`;
        const renameFields = {
            studentKey: updatedKey,
            studentId: student.studentId,
            studentName: student.name,
            name: student.name,
            className: student.className,
            class: student.className
        };

        window.cbtApp.attempts = window.cbtApp.attempts.map(attempt => {
            if (attempt.studentKey !== previousKey) return attempt;
            const newId = window.cbtBackend.buildAttemptId(student.studentId, attempt.subjectId);
            return { ...attempt, ...renameFields, id: newId };
        });
        window.cbtApp.results = window.cbtApp.results.map(result => {
            if (result.studentKey !== previousKey) return result;
            const newId = window.cbtBackend.buildAttemptId(student.studentId, result.subjectId);
            return { ...result, ...renameFields, id: newId };
        });

        // Delete the documents that were stored under the OLD deterministic IDs.
        // The renamed attempts are written under their new IDs by
        // persistAdminAttempts() below.
        window.cbtApp.attempts.forEach(attempt => {
            const oldId = window.cbtBackend.buildAttemptId(previousId, attempt.subjectId);
            if (oldId !== attempt.id) {
                window.cbtBackend.deleteAttempt(oldId).catch(error => {
                    console.warn('[admin] could not delete the pre-rename attempt document', error);
                });
            }
        });
    }

    window.cbtApp.students = originalId
        ? window.cbtApp.students.map(entry => String(entry.id) === originalId ? student : entry)
        : window.cbtApp.students.concat(student);

    const saved = await saveAdminData('students');
    if (saved && renamed) {
        // persistAdminAttempts rewrites every attempt under its new ID.
        await persistAdminAttempts();
    }
    renderAdminPage();
    if (saved) showAdminNotice('Student saved.');
}

/**
 * Signs in with Firebase Email/Password, then loads the admin-only roster and
 * results before revealing the dashboard.
 *
 * Nothing is rendered until loadAdminRecords() succeeds, so a failed rules
 * check can never leave an empty dashboard looking like "no data".
 */
async function handleAdminLogin(email, password) {
    try {
        // signIn() additionally enforces that the account's email is the
        // approved administrator address.
        await window.cbtBackend.signIn(email, password);
        const records = await window.cbtBackend.loadAdminRecords();
        window.cbtApp.students = records.students;
        window.cbtApp.attempts = records.attempts;
        window.cbtApp.results = records.results;
        // Offer to seed the roster from the built-in sample list when the project
        // is brand new and Firestore has no students yet.
        await window.cbtBackend.seedRosterIfEmpty(window.cbtApp.sampleStudents || []);
        const refreshed = await window.cbtBackend.loadAdminRecords();
        window.cbtApp.students = refreshed.students;
        adminLoggedIn = true;
        adminSection = 'Dashboard';
        renderAdminPage();
    } catch (error) {
        console.error('[admin] sign in failed', error);
        showAdminLogin((error && error.message) || 'Unable to sign in. Please try again.');
    }
}

function showAdminNotice(message, isError = false) {
    const notice = adminRoot.querySelector('.admin-notice');
    if (!notice) return;
    notice.textContent = adminStorageError
        ? 'Could not save changes. Check available browser storage and try again.'
        : message;
    notice.classList.toggle('error', isError || adminStorageError);
    notice.hidden = false;
    window.clearTimeout(showAdminNotice.timeoutId);
    showAdminNotice.timeoutId = window.setTimeout(() => {
        if (notice.isConnected) notice.hidden = true;
    }, 4500);
}

async function showAdminLogin(message = '') {
    const backend = window.cbtBackend;
    let statusNote = '';
    if (backend) {
        const status = await backend.status();
        if (status.state === 'unconfigured') {
            statusNote = 'Firebase is not configured yet. Add the Web app values to firebase.config.js before signing in.';
        } else if (status.state === 'error') {
            statusNote = status.error || 'Firebase could not start. Check your internet connection.';
        } else if (!navigator.onLine) {
            statusNote = 'You are offline. The administrator panel needs an internet connection.';
        }
    } else {
        statusNote = 'Firebase did not load. Check that firebase.js is reachable.';
    }

    adminRoot.innerHTML = `
        <section class="admin-login-card">
            <button type="button" class="admin-back-link" data-action="close-admin">← Back to student exam</button>
            <p class="admin-eyebrow">School CBT System</p>
            <h1>Administrator Login</h1>
            <p class="admin-muted">Sign in with the administrator email address and password.</p>
            ${statusNote ? `<div class="admin-security-note">${escapeAdminText(statusNote)}</div>` : ''}
            <p class="admin-login-error" role="alert">${escapeAdminText(message)}</p>
            <form data-form="login" class="admin-form">
                <label>Administrator email<input name="username" type="email" autocomplete="username"
                    value="${escapeAdminText(window.cbtAdminEmail || 'abuhafs8007@gmail.com')}" required></label>
                <label>Password<input name="password" type="password" autocomplete="current-password" required></label>
                <button class="admin-primary-button" type="submit">Log in</button>
            </form>
        </section>`;
}

function adminShell(content) {
    const nav = adminSections.map(section => `
        <button type="button" class="admin-nav-item ${section === adminSection ? 'active' : ''}"
            data-action="navigate" data-section="${escapeAdminText(section)}">${escapeAdminText(section)}</button>
    `).join('');
    adminRoot.innerHTML = `
        <div class="admin-layout">
            <div class="admin-sidebar-backdrop" data-action="close-sidebar"></div>
            <aside class="admin-sidebar">
                <div class="admin-brand"><span class="admin-brand-mark">CBT</span><div>
                    <strong>${escapeAdminText(window.cbtApp.settings.schoolName)}</strong>
                    <small>Administrator panel</small>
                </div></div>
                <nav aria-label="Administrator navigation">${nav}</nav>
                <button type="button" class="admin-logout" data-action="logout">Log out</button>
            </aside>
            <div class="admin-main">
                <header class="admin-topbar">
                    <div class="admin-topbar-left">
                        <button type="button" class="admin-mobile-menu-toggle" data-action="toggle-sidebar" aria-label="Toggle navigation">
                            <span></span><span></span><span></span>
                        </button>
                        <div><span class="admin-eyebrow">School examination management</span>
                            <h1>${escapeAdminText(adminSection)}</h1></div>
                    </div>
                    <button type="button" class="admin-mobile-logout" data-action="logout">Log out</button>
                </header>
                <p class="admin-notice ${adminStorageError ? 'error' : ''}" role="status" ${adminStorageError ? '' : 'hidden'}>${adminStorageError ? 'Could not save changes. Check available browser storage and try again.' : ''}</p>
                <section class="admin-content">${content}</section>
            </div>
        </div>`;
}

function renderDashboard() {
    const students = window.cbtApp.students;
    const subjects = window.cbtApp.subjects;
    const attempts = window.cbtApp.attempts;
    const questionCount = allQuestions().length;
    const completed = attempts.filter(attempt => attempt.status === 'Completed').length;
    const pending = attempts.filter(attempt => attempt.status === 'In Progress').length;
    const enabled = subjects.filter(subject => subject.isEnabled).length;
    const disabled = subjects.length - enabled;
    const cards = [
        ['Total Students', students.length, 'Registered student records'],
        ['Total Subjects', subjects.length, 'Available exam subjects'],
        ['Total Questions', questionCount, 'Across all classes and subjects'],
        ['Completed Exams', completed, 'Saved completed attempts'],
        ['Pending Attempts', pending, 'In-progress exam records'],
        ['Enabled Exams', enabled, 'Students may access enabled subjects'],
        ['Disabled Exams', disabled, 'Subjects hidden from students']
    ];
    return `<div class="admin-dashboard-grid">${cards.map(([title, value, caption]) => `
        <article class="admin-stat-card"><span>${title}</span><strong>${value}</strong><small>${caption}</small></article>
    `).join('')}</div>
    <div class="admin-welcome-card"><h2>Welcome to the school CBT dashboard</h2>
        <p>Manage students, question banks, subject timers, attempts, and local result records from the navigation.</p>
        <p class="admin-local-warning">All records are stored in this browser only. Clearing browser data removes them.</p>
    </div>`;
}

function renderStudents() {
    const students = window.cbtApp.students.filter(student => {
        const text = `${student.name} ${student.studentId} ${student.className}`.toLowerCase();
        return text.includes(studentSearch.toLowerCase());
    });
    return `<div class="admin-section-heading"><div><h2>Students</h2><p>Add and maintain local student records.</p></div>
        <div class="admin-section-actions">
            <button class="admin-light-button" type="button" data-action="download-student-template">Download Student Template</button>
            <button class="admin-light-button" type="button" data-action="import-students">Import Students</button>
            <button class="admin-primary-button" type="button" data-action="new-student">Add Student</button>
        </div></div>
        <div class="admin-toolbar"><input data-search="students" value="${escapeAdminText(studentSearch)}" placeholder="Search name, student ID, or class"></div>
        ${adminImportState && adminImportState.mode === 'students' ? createImportMarkup('students', adminImportState.preview) : ''}
        <form data-form="student" class="admin-form admin-edit-form" hidden>
            <input type="hidden" name="originalId">
            <label>Full name<input name="name" required></label>
            <label>Student ID<input name="studentId" required></label>
            <label>Class<input name="className" placeholder="JSS 2" required></label>
            <div class="admin-form-actions"><button class="admin-primary-button" type="submit">Save Student</button>
                <button class="admin-light-button" type="button" data-action="cancel-form">Cancel</button></div>
        </form>
        <div class="admin-table-wrap"><table><thead><tr><th>Student</th><th>Student ID</th><th>Class</th><th>Actions</th></tr></thead>
        <tbody>${students.length ? students.map(student => `<tr>
            <td>${escapeAdminText(student.name)}</td><td>${escapeAdminText(student.studentId)}</td><td>${escapeAdminText(student.className)}</td>
            <td class="admin-actions">
                <button data-action="student-view" data-id="${escapeAdminText(student.id)}">View</button>
                <button data-action="student-edit" data-id="${escapeAdminText(student.id)}">Edit</button>
                <button data-action="student-reset" data-id="${escapeAdminText(student.id)}">Reset Attempt</button>
                <button class="danger" data-action="student-delete" data-id="${escapeAdminText(student.id)}">Remove</button>
            </td></tr>`).join('') : '<tr><td colspan="4" class="admin-empty">No students found.</td></tr>'}</tbody></table></div>`;
}

function subjectSelectOptions(selected = '') {
    return window.cbtApp.subjects.map(subject =>
        `<option value="${escapeAdminText(subject.id)}" ${subject.id === selected ? 'selected' : ''}>${escapeAdminText(subject.name)}</option>`
    ).join('');
}

function questionDifficultyFromClass(classValue) {
    const normalized = normalizeAdminClass(classValue);
    if (normalized === 'JSS 1') return 'easy';
    if (normalized === 'JSS 2') return 'medium';
    if (normalized === 'JSS 3') return 'hard';
    return '';
}

function questionClassLabelFromDifficulty(difficulty) {
    return { easy: 'JSS 1', medium: 'JSS 2', hard: 'JSS 3' }[difficulty] || '';
}

function getSubjectTimerMap(subject) {
    const timers = subject && subject.timers && typeof subject.timers === 'object' ? subject.timers : {};
    return Object.entries(timers).reduce((map, [className, duration]) => {
        const normalized = normalizeAdminClass(className);
        if (normalized && Number.isFinite(Number(duration))) {
            map[normalized] = Number(duration);
        }
        return map;
    }, {});
}

function readSubjectTimersFromForm(values) {
    const timers = {};
    adminClassOptions.forEach((className, index) => {
        const value = Number(values.get(`timer_${index}`));
        if (Number.isInteger(value) && value >= 1 && value <= 300) {
            timers[className] = value;
        }
    });
    const classTimer = values.get('className') && Number(values.get('durationMinutes'));
    if (adminClassOptions.includes(normalizeAdminClass(values.get('className'))) && Number.isInteger(classTimer) && classTimer >= 1 && classTimer <= 300) {
        timers[normalizeAdminClass(values.get('className'))] = classTimer;
    }
    return timers;
}

function parseQuestionAnswer(value) {
    const normalized = String(value ?? '').trim().toUpperCase();
    if (!normalized) return { valid: false, index: null, message: 'Correct Answer is empty.' };
    const directMap = { A: 0, B: 1, C: 2, D: 3, 0: 0, 1: 1, 2: 2, 3: 3 };
    if (directMap[normalized] !== undefined) {
        return { valid: true, index: directMap[normalized] };
    }
    return { valid: false, index: null, message: 'Correct Answer is invalid. Expected A, B, C, or D.' };
}

function findMatchingSubject(label) {
    const target = normalizeAdminText(label).toLowerCase();
    if (!target) return null;
    return window.cbtApp.subjects.find(subject => {
        const subjectText = normalizeAdminText(subject.name).toLowerCase();
        const subjectIdText = normalizeAdminText(subject.id).toLowerCase();
        return subjectText === target || subjectIdText === target;
    }) || null;
}

function buildQuestionImportPreview(csvText) {
    const rows = parseAdminCsv(csvText);
    if (!rows.length) {
        return { valid: false, errors: ['The CSV file is empty.'], rows: [] };
    }

    const headers = rows[0].map(cell => normalizeAdminText(cell).toLowerCase());
    const requiredHeaders = ['question', 'option a', 'option b', 'option c', 'option d', 'correct answer', 'subject', 'class'];
    if (headers.length < requiredHeaders.length || requiredHeaders.some((expected, index) => headers[index] !== expected)) {
        return { valid: false, errors: ['CSV headers do not match the required format. Use: Question,Option A,Option B,Option C,Option D,Correct Answer,Subject,Class.'], rows: [] };
    }

    const dataRows = rows.slice(1).map((values, index) => {
        const rowNumber = index + 2;
        const questionText = normalizeAdminText(values[0]);
        const options = [1, 2, 3, 4].map((offset) => normalizeAdminText(values[offset]));
        const answerValue = parseQuestionAnswer(values[5]);
        const subjectLabel = normalizeAdminText(values[6]);
        const classValue = normalizeAdminClass(values[7]);
        const subject = findMatchingSubject(subjectLabel);
        const difficulty = questionDifficultyFromClass(classValue);
        const errors = [];

        if (!questionText) errors.push('Question is empty.');
        options.forEach((option, optionIndex) => {
            if (!option) errors.push(`Option ${String.fromCharCode(65 + optionIndex)} is empty.`);
        });
        if (!answerValue.valid) errors.push(answerValue.message);
        if (!subject) errors.push('Subject does not exist.');
        if (!classValue || !difficulty) errors.push('Class is invalid. Expected JSS 1, JSS 2, or JSS 3.');

        const duplicateQuestion = allQuestions().find(item => {
            const isSameQuestion = item.question.q.trim() === questionText;
            const isSameSubject = item.subjectId === (subject && subject.id);
            const isSameClass = item.difficulty === difficulty;
            return isSameQuestion && isSameSubject && isSameClass;
        });
        if (duplicateQuestion) errors.push('Duplicate question already exists.');

        return {
            rowNumber,
            questionText,
            options,
            answerIndex: answerValue.valid ? answerValue.index : null,
            subjectName: subjectLabel,
            subjectId: subject ? subject.id : '',
            className: classValue,
            difficulty,
            syntax: questionText && options.every(Boolean) && answerValue.valid && subject && difficulty,
            errors,
            duplicate: Boolean(duplicateQuestion)
        };
    });

    const invalidRows = dataRows.filter(row => row.errors.length);
    return {
        valid: !invalidRows.length,
        errors: invalidRows.map(row => `Row ${row.rowNumber} — ${row.errors.join(' ')}`),
        rows: dataRows
    };
}

function buildStudentImportPreview(csvText) {
    const rows = parseAdminCsv(csvText);
    if (!rows.length) {
        return { valid: false, errors: ['The CSV file is empty.'], rows: [] };
    }

    const headers = rows[0].map(cell => normalizeAdminText(cell).toLowerCase());
    const requiredHeaders = ['student id', 'student name', 'class'];
    if (headers.length < requiredHeaders.length || requiredHeaders.some((expected, index) => headers[index] !== expected)) {
        return { valid: false, errors: ['CSV headers do not match the required format. Use: Student ID,Student Name,Class.'], rows: [] };
    }

    const studentIdsInFile = new Set();
    const dataRows = rows.slice(1).map((values, index) => {
        const rowNumber = index + 2;
        const studentId = normalizeAdminText(values[0]);
        const name = normalizeAdminText(values[1]);
        const className = normalizeAdminClass(values[2]);
        const errors = [];

        if (!studentId) errors.push('Student ID is empty.');
        if (!name) errors.push('Student Name is empty.');
        if (!adminClassOptions.includes(className)) errors.push('Class is invalid. Expected JSS 1, JSS 2, or JSS 3.');

        if (studentId) {
            if (studentIdsInFile.has(studentId.toUpperCase())) {
                errors.push('Duplicate Student ID found within the uploaded file.');
            }
            studentIdsInFile.add(studentId.toUpperCase());
        }

        const existingStudent = window.cbtApp.students.find(student =>
            normalizeAdminText(student.studentId || student.id).toUpperCase() === studentId.toUpperCase()
        );
        if (existingStudent) errors.push('Duplicate Student ID already exists in the current school records.');

        return {
            rowNumber,
            studentId,
            name,
            className,
            valid: !errors.length,
            errors
        };
    });

    const invalidRows = dataRows.filter(row => row.errors.length);
    return {
        valid: !invalidRows.length,
        errors: invalidRows.map(row => `Row ${row.rowNumber} — ${row.errors.join(' ')}`),
        rows: dataRows
    };
}

function createImportMarkup(mode, preview) {
    const rows = preview.rows || [];
    const errors = preview.errors || [];
    const tableRows = rows.length
        ? rows.map(row => {
            if (mode === 'questions') {
                return `<tr>
                    <td>${row.rowNumber}</td>
                    <td>${escapeAdminText(row.questionText || '--')}</td>
                    <td>${escapeAdminText(row.options.join(' / ') || '--')}</td>
                    <td>${escapeAdminText(row.answerIndex !== null ? ['A', 'B', 'C', 'D'][row.answerIndex] : '--')}</td>
                    <td>${escapeAdminText(row.subjectName || '--')}</td>
                    <td>${escapeAdminText(row.className || '--')}</td>
                    <td>${row.errors.length ? '<span class="admin-import-status error">Invalid</span>' : '<span class="admin-import-status ok">Valid</span>'}</td>
                </tr>`;
            }
            return `<tr>
                <td>${row.rowNumber}</td>
                <td>${escapeAdminText(row.studentId || '--')}</td>
                <td>${escapeAdminText(row.name || '--')}</td>
                <td>${escapeAdminText(row.className || '--')}</td>
                <td>${row.errors.length ? '<span class="admin-import-status error">Invalid</span>' : '<span class="admin-import-status ok">Valid</span>'}</td>
            </tr>`;
        }).join('')
        : '<tr><td colspan="7" class="admin-empty">No preview data available.</td></tr>';

    const headerText = mode === 'questions' ? ['Row', 'Question', 'Options', 'Correct', 'Subject', 'Class', 'Status'] : ['Row', 'Student ID', 'Name', 'Class', 'Status'];
    const thMarkup = headerText.map(title => `<th>${escapeAdminText(title)}</th>`).join('');

    const errorMarkup = errors.length
        ? `<div class="admin-import-errors"><strong>Validation issues found:</strong><ul>${errors.map(error => `<li>${escapeAdminText(error)}</li>`).join('')}</ul></div>`
        : '<div class="admin-import-ok">All rows passed validation.</div>';

    return `
        <div class="admin-import-panel">
            <div class="admin-import-header">
                <div>
                    <h3>${mode === 'questions' ? 'CSV Question Preview' : 'CSV Student Preview'}</h3>
                    <p>${mode === 'questions' ? 'Review each row before adding to the question bank.' : 'Review each row before importing students.'}</p>
                </div>
                <div class="admin-import-actions">
                    <button type="button" class="admin-light-button" data-action="cancel-import">Cancel</button>
                    <button type="button" class="admin-primary-button" data-action="confirm-import" ${preview.valid ? '' : 'disabled'}>${mode === 'questions' ? 'Confirm Import' : 'Confirm Students'}</button>
                </div>
            </div>
            ${errorMarkup}
            <div class="admin-table-wrap"><table><thead><tr>${thMarkup}</tr></thead><tbody>${tableRows}</tbody></table></div>
        </div>
    `;
}

function renderQuestions() {
    const matches = allQuestions().filter(item => {
        const subject = window.cbtApp.subjects.find(entry => entry.id === item.subjectId);
        return (!questionSubjectFilter || item.subjectId === questionSubjectFilter) &&
            `${item.question.q} ${subject ? subject.name : item.subjectId}`.toLowerCase().includes(questionSearch.toLowerCase());
    });
    return `<div class="admin-section-heading"><div><h2>Questions</h2><p>Question format remains { q, opts, ans }.</p></div>
        <div class="admin-section-actions">
            <button class="admin-light-button" type="button" data-action="download-question-template">Download Question Template</button>
            <button class="admin-light-button" type="button" data-action="import-questions">Import Questions</button>
            <button class="admin-primary-button" type="button" data-action="new-question">Add Question</button>
        </div></div>
        <div class="admin-toolbar">
            <input data-search="questions" value="${escapeAdminText(questionSearch)}" placeholder="Search question text">
            <select data-filter="question-subject"><option value="">All subjects</option>${subjectSelectOptions(questionSubjectFilter)}</select>
        </div>
        ${adminImportState && adminImportState.mode === 'questions' ? createImportMarkup('questions', adminImportState.preview) : ''}
        <form data-form="question" class="admin-form admin-edit-form" hidden>
            <input type="hidden" name="originalIndex">
            <label>Question<textarea name="question" rows="3" required></textarea></label>
            <div class="admin-two-column">
                <label>Option A<input name="option0" required></label><label>Option B<input name="option1" required></label>
                <label>Option C<input name="option2" required></label><label>Option D<input name="option3" required></label>
            </div>
            <div class="admin-two-column">
                <label>Subject<select name="subjectId" required>${subjectSelectOptions()}</select></label>
                <label>Class<select name="difficulty"><option value="easy">JSS 1</option><option value="medium">JSS 2</option><option value="hard">JSS 3</option></select></label>
                <label>Correct answer<select name="answer"><option value="0">Option A</option><option value="1">Option B</option><option value="2">Option C</option><option value="3">Option D</option></select></label>
            </div>
            <div class="admin-form-actions"><button class="admin-primary-button" type="submit">Save Question</button>
                <button class="admin-light-button" type="button" data-action="cancel-form">Cancel</button></div>
        </form>
        <div class="admin-table-wrap"><table><thead><tr><th>Question</th><th>Subject</th><th>Class</th><th>Answer</th><th>Actions</th></tr></thead>
        <tbody>${matches.length ? matches.map(item => `<tr>
            <td>${escapeAdminText(item.question.q)}</td>
            <td>${escapeAdminText((window.cbtApp.subjects.find(subject => subject.id === item.subjectId) || {}).name || item.subjectId)}</td>
            <td>${escapeAdminText({ easy: 'JSS 1', medium: 'JSS 2', hard: 'JSS 3' }[item.difficulty] || item.difficulty)}</td>
            <td>${escapeAdminText(item.question.opts[item.question.ans])}</td>
            <td class="admin-actions">
                <button data-action="question-edit" data-subject="${escapeAdminText(item.subjectId)}" data-level="${escapeAdminText(item.difficulty)}" data-index="${item.index}">Edit</button>
                <button class="danger" data-action="question-delete" data-subject="${escapeAdminText(item.subjectId)}" data-level="${escapeAdminText(item.difficulty)}" data-index="${item.index}">Delete</button>
            </td></tr>`).join('') : '<tr><td colspan="5" class="admin-empty">No questions match this filter.</td></tr>'}</tbody></table></div>`;
}

function renderSubjects() {
    return `<div class="admin-section-heading"><div><h2>Subjects / Exams</h2><p>Set access, subject-specific timer, and instructions.</p></div>
        <button class="admin-primary-button" type="button" data-action="new-subject">Add Subject</button></div>
        <form data-form="subject" class="admin-form admin-edit-form" hidden>
            <input type="hidden" name="id">
            <label>Subject name<input name="name" required></label>
            <label>Class<select name="className" required>${adminClassOptions.map(option => `<option value="${escapeAdminText(option)}">${escapeAdminText(option)}</option>`).join('')}</select></label>
            <label>Default exam duration (minutes)<input name="durationMinutes" type="number" min="1" max="300" required></label>
            <div class="admin-timer-grid">
                ${adminClassOptions.map((className, index) => `
                    <label>${escapeAdminText(className)}
                        <input name="timer_${index}" type="number" min="1" max="300" value="${window.cbtApp.settings.defaultDuration}">
                    </label>
                `).join('')}
            </div>
            <label>Exam instructions<textarea name="instructions" rows="3"></textarea></label>
            <label class="admin-check-label"><input name="isEnabled" type="checkbox"> Exam enabled for students</label>
            <div class="admin-form-actions"><button class="admin-primary-button" type="submit">Save Subject</button>
                <button class="admin-light-button" type="button" data-action="cancel-form">Cancel</button></div>
        </form>
        <div class="admin-table-wrap"><table><thead><tr><th>Subject</th><th>Questions</th><th>Class Timers</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>${window.cbtApp.subjects.map(subject => {
            const count = allQuestions().filter(item => item.subjectId === subject.id).length;
            const timers = getSubjectTimerMap(subject);
            const timerText = Object.keys(timers).length
                ? Object.entries(timers).map(([className, duration]) => `${escapeAdminText(className)}: ${escapeAdminText(duration)} min`).join(' / ')
                : `${escapeAdminText(subject.durationMinutes || window.cbtApp.settings.defaultDuration)} min`;
            return `<tr><td>${escapeAdminText(subject.name)}</td><td>${count}</td><td>${timerText}</td>
                <td><span class="admin-status ${subject.isEnabled ? 'enabled' : 'disabled'}">${subject.isEnabled ? 'Enabled' : 'Disabled'}</span></td>
                <td class="admin-actions"><button data-action="subject-toggle" data-id="${escapeAdminText(subject.id)}">${subject.isEnabled ? 'Disable' : 'Enable'}</button>
                    <button data-action="subject-edit" data-id="${escapeAdminText(subject.id)}">Edit</button>
                    <button class="danger" data-action="subject-delete" data-id="${escapeAdminText(subject.id)}">Remove</button></td></tr>`;
        }).join('')}</tbody></table></div>`;
}

function renderAttempts() {
    const attempts = window.cbtApp.attempts.slice().sort((a, b) =>
        String(b.dateCompleted || b.dateStarted || '').localeCompare(String(a.dateCompleted || a.dateStarted || ''))
    );
    return `<div class="admin-section-heading"><div><h2>Attempts</h2><p>Inspect, edit, reset, or remove a student's attempt.</p></div></div>
        <div class="admin-table-wrap"><table><thead><tr><th>Student ID</th><th>Student</th><th>Class</th><th>Subject</th><th>Status</th><th>Score</th><th>Date</th><th>Time used</th><th>Actions</th></tr></thead>
        <tbody>${attempts.length ? attempts.map(attempt => `<tr>
            <td>${escapeAdminText(attempt.studentId || '--')}</td><td>${escapeAdminText(attempt.studentName)}</td><td>${escapeAdminText(attempt.className)}</td>
            <td>${escapeAdminText(attempt.subjectName || attempt.subjectId)}</td>
            <td>${escapeAdminText(attempt.status)}</td><td>${Number(attempt.score) || 0}/${Number(attempt.totalQuestions) || 0}</td>
            <td>${escapeAdminText(formatAdminDate(attempt.dateCompleted || attempt.dateStarted))}</td>
            <td>${escapeAdminText(attempt.timeUsed || '--')}</td><td class="admin-actions">
                <button data-action="attempt-view" data-id="${escapeAdminText(attempt.id)}">View</button>
                <button data-action="attempt-reset" data-id="${escapeAdminText(attempt.id)}">Reset</button>
                <button data-action="attempt-complete" data-id="${escapeAdminText(attempt.id)}">Mark completed</button>
                <button data-action="attempt-edit" data-id="${escapeAdminText(attempt.id)}">Edit score</button>
                <button class="danger" data-action="attempt-delete" data-id="${escapeAdminText(attempt.id)}">Delete</button>
            </td></tr>`).join('') : '<tr><td colspan="9" class="admin-empty">No attempts have been recorded.</td></tr>'}</tbody></table></div>`;
}

function renderResults() {
    const attempts = window.cbtApp.results.filter(result => {
        const search = `${result.studentName || result.name} ${result.studentId} ${result.subject} ${result.className}`.toLowerCase();
        return (!resultFilters.search || search.includes(resultFilters.search.toLowerCase())) &&
            (!resultFilters.student || (result.studentName || result.name) === resultFilters.student) &&
            (!resultFilters.className || result.className === resultFilters.className) &&
            (!resultFilters.subject || result.subjectId === resultFilters.subject) &&
            (!resultFilters.status || result.status === resultFilters.status);
    });
    const students = [...new Set(window.cbtApp.results.map(result => result.studentName || result.name).filter(Boolean))];
    const classes = [...new Set(window.cbtApp.results.map(result => result.className).filter(Boolean))];
    return `<div class="admin-section-heading"><div><h2>Results</h2><p>Student score records saved on this device.</p></div></div>
        <div class="admin-filter-grid">
            <input data-result-filter="search" value="${escapeAdminText(resultFilters.search)}" placeholder="Search results">
            <select data-result-filter="student"><option value="">All students</option>${students.map(name => `<option ${resultFilters.student === name ? 'selected' : ''} value="${escapeAdminText(name)}">${escapeAdminText(name)}</option>`).join('')}</select>
            <select data-result-filter="className"><option value="">All classes</option>${classes.map(name => `<option ${resultFilters.className === name ? 'selected' : ''} value="${escapeAdminText(name)}">${escapeAdminText(name)}</option>`).join('')}</select>
            <select data-result-filter="subject"><option value="">All subjects</option>${subjectSelectOptions(resultFilters.subject)}</select>
            <select data-result-filter="status"><option value="">All statuses</option><option ${resultFilters.status === 'Completed' ? 'selected' : ''}>Completed</option><option ${resultFilters.status === 'In Progress' ? 'selected' : ''}>In Progress</option></select>
        </div>
        <div class="admin-table-wrap"><table><thead><tr><th>Student</th><th>Student ID</th><th>Class</th><th>Subject</th><th>Score</th><th>Percentage</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>${attempts.length ? attempts.map(result => `<tr>
            <td>${escapeAdminText(result.studentName || result.name)}</td><td>${escapeAdminText(result.studentId || '--')}</td>
            <td>${escapeAdminText(result.className || result.class)}</td><td>${escapeAdminText(result.subject)}</td>
            <td>${Number(result.score) || 0}/${Number(result.totalQuestions) || 0}</td><td>${Number(result.percentage) || 0}%</td>
            <td>${escapeAdminText(result.status)}</td><td>${escapeAdminText(formatAdminDate(result.timestamp || result.dateCompleted))}</td>
        </tr>`).join('') : '<tr><td colspan="8" class="admin-empty">No results match these filters.</td></tr>'}</tbody></table></div>`;
}

function renderSettings() {
    const settings = window.cbtApp.settings;
    return `<div class="admin-section-heading"><div><h2>Settings</h2><p>Simple platform defaults for this browser.</p></div></div>
        <form data-form="settings" class="admin-form">
            <label>School name<input name="schoolName" value="${escapeAdminText(settings.schoolName)}" required></label>
            <label>Exam platform name<input name="platformName" value="${escapeAdminText(settings.platformName)}" required></label>
            <label>Default exam duration (minutes)<input name="defaultDuration" type="number" min="1" max="300" value="${escapeAdminText(settings.defaultDuration)}" required></label>
            <label>Default number of questions<input name="numberOfQuestions" type="number" min="5" max="60" value="${escapeAdminText(settings.numberOfQuestions)}" required></label>
            <label>Passing score (%)<input name="passingScore" type="number" min="0" max="100" value="${escapeAdminText(settings.passingScore)}" required></label>
            <label>Exam instructions<textarea name="examInstructions" rows="4">${escapeAdminText(settings.examInstructions)}</textarea></label>
            <label class="admin-check-label"><input name="allowResults" type="checkbox" ${settings.allowResults ? 'checked' : ''}> Show results to students after submission</label>
            <button class="admin-primary-button" type="submit">Save Settings</button>
        </form>
        <div class="admin-security-note">Admin username and password are editable constants in admin.js. Because this is frontend-only, they are not secure.</div>`;
}

function formatAdminDate(value) {
    if (!value) return '--';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '--' : date.toLocaleString();
}

function renderAdminPage() {
    if (!adminLoggedIn) {
        showAdminLogin();
        return;
    }
    const renderers = {
        Dashboard: renderDashboard,
        Students: renderStudents,
        Questions: renderQuestions,
        'Subjects / Exams': renderSubjects,
        Attempts: renderAttempts,
        Results: renderResults,
        Settings: renderSettings
    };
    adminShell(renderers[adminSection]());
}

function setFormValue(form, name, value) {
    const input = form.elements.namedItem(name);
    if (input) input.value = value ?? '';
}

function openAdmin() {
    studentApp.hidden = true;
    studentApp.style.display = 'none';
    adminRoot.hidden = false;
    // If a valid admin session already exists (e.g. the page was reloaded), go
    // straight to the dashboard instead of showing the login form.
    if (window.cbtBackend && window.cbtBackend.isAdminUser()) {
        restoreAdminSession();
        return;
    }
    showAdminLogin();
}

function closeAdmin(logout = false) {
    if (logout) {
        adminLoggedIn = false;
        if (window.cbtBackend) window.cbtBackend.signOut();
    }
    adminRoot.hidden = true;
    studentApp.hidden = false;
    studentApp.style.display = '';
    window.cbtApp.refreshStudentSubjects();
}

/**
 * Re-loads the admin-only roster and results for an already-authenticated
 * session. Called on page load when Firebase reports a valid admin session.
 */
async function restoreAdminSession() {
    try {
        const records = await window.cbtBackend.loadAdminRecords();
        window.cbtApp.students = records.students;
        window.cbtApp.attempts = records.attempts;
        window.cbtApp.results = records.results;
        adminLoggedIn = true;
        renderAdminPage();
    } catch (error) {
        console.error('[admin] could not restore the admin session', error);
        adminLoggedIn = false;
        showAdminLogin((error && error.message) || 'Your session is no longer valid. Please sign in again.');
    }
}

/**
 * Deletes an attempt (and its public status marker) from Firestore, then drops
 * it from the in-memory arrays so the UI re-renders without it.
 *
 * 'attempts' and 'results' are the SAME Firestore collection, so a single
 * deletion covers both views; the second saveAdminData call is intentionally
 * not needed.
 */
async function removeAttempt(attemptId) {
    try {
        await window.cbtBackend.deleteAttempt(attemptId);
    } catch (error) {
        console.error('[admin] could not delete the attempt', error);
        adminStorageError = true;
        showAdminNotice(
            (error && error.message) || 'Could not delete the attempt from Firestore.',
            true
        );
        return false;
    }
    window.cbtApp.attempts = window.cbtApp.attempts.filter(attempt => attempt.id !== attemptId);
    window.cbtApp.results = window.cbtApp.results.filter(result => result.id !== attemptId);
    adminStorageError = false;
    return true;
}

function buildResultFromAttempt(attempt) {
    return {
        ...attempt,
        id: attempt.id,
        name: attempt.studentName,
        class: attempt.className,
        subject: attempt.subjectName || attempt.subjectId,
        timestamp: attempt.dateCompleted || new Date().toISOString(),
        status: 'Completed'
    };
}

adminEntryButton.addEventListener('click', openAdmin);

adminRoot.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === 'close-admin') return closeAdmin();
    if (action === 'logout') return closeAdmin(true);
    if (action === 'toggle-sidebar') {
        const layout = button.closest('.admin-layout');
        if (!layout) return;
        layout.classList.toggle('sidebar-open');
        return;
    }
    if (action === 'close-sidebar') {
        const layout = button.closest('.admin-layout');
        if (layout) layout.classList.remove('sidebar-open');
        return;
    }
    if (action === 'navigate') {
        adminSection = button.dataset.section;
        const layout = button.closest('.admin-layout');
        if (layout) layout.classList.remove('sidebar-open');
        renderAdminPage();
        return;
    }
    if (action === 'cancel-form') {
        const form = button.closest('form');
        if (form) form.hidden = true;
        return;
    }
    if (action === 'cancel-import') {
        adminImportState = null;
        renderAdminPage();
        return;
    }
    if (action === 'download-question-template') {
        generateQuestionCsvTemplate();
        return;
    }
    if (action === 'download-student-template') {
        generateStudentCsvTemplate();
        return;
    }
    if (action === 'import-questions') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,text/csv';
        input.addEventListener('change', event => {
            const [file] = event.target.files || [];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                const preview = buildQuestionImportPreview(String(reader.result || ''));
                adminImportState = { mode: 'questions', preview };
                renderAdminPage();
            };
            reader.readAsText(file, 'UTF-8');
        }, { once: true });
        input.click();
        return;
    }
    if (action === 'import-students') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,text/csv';
        input.addEventListener('change', event => {
            const [file] = event.target.files || [];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                const preview = buildStudentImportPreview(String(reader.result || ''));
                adminImportState = { mode: 'students', preview };
                renderAdminPage();
            };
            reader.readAsText(file, 'UTF-8');
        }, { once: true });
        input.click();
        return;
    }
    if (action === 'confirm-import') {
        if (!adminImportState || !adminImportState.preview || !adminImportState.preview.valid) {
            return showAdminNotice('Fix the validation errors before importing.', true);
        }
        if (adminImportState.mode === 'questions') {
            const validRows = adminImportState.preview.rows.filter(row => !row.errors.length);
            validRows.forEach(row => {
                const subject = findMatchingSubject(row.subjectName);
                if (!subject) return;
                const difficulty = questionDifficultyFromClass(row.className);
                if (!difficulty) return;
                if (!window.cbtApp.questions[subject.id]) window.cbtApp.questions[subject.id] = {};
                if (!Array.isArray(window.cbtApp.questions[subject.id][difficulty])) {
                    window.cbtApp.questions[subject.id][difficulty] = [];
                }
                window.cbtApp.questions[subject.id][difficulty].push({
                    q: row.questionText,
                    opts: row.options,
                    ans: row.answerIndex
                });
            });
            saveAdminData('questions');
            window.cbtApp.refreshStudentSubjects();
            adminImportState = null;
            renderAdminPage();
            showAdminNotice('Question records imported successfully.');
            return;
        }
        if (adminImportState.mode === 'students') {
            const validRows = adminImportState.preview.rows.filter(row => !row.errors.length);
            validRows.forEach(row => {
                const existing = window.cbtApp.students.find(student =>
                    normalizeAdminText(student.studentId || student.id).toUpperCase() === normalizeAdminText(row.studentId).toUpperCase()
                );
                if (!existing) {
                    window.cbtApp.students = window.cbtApp.students.concat({
                        id: row.studentId,
                        name: row.name,
                        studentId: row.studentId,
                        className: row.className
                    });
                }
            });
            saveAdminData('students');
            adminImportState = null;
            renderAdminPage();
            showAdminNotice('Student records imported successfully.');
            return;
        }
    }
    if (action === 'new-student') {
        const form = adminRoot.querySelector('[data-form="student"]');
        form.reset();
        form.elements.namedItem('originalId').value = '';
        form.hidden = false;
        return;
    }
    if (action === 'student-edit') {
        const student = window.cbtApp.students.find(entry => String(entry.id) === id);
        const form = adminRoot.querySelector('[data-form="student"]');
        if (!student || !form) return;
        setFormValue(form, 'originalId', student.id);
        setFormValue(form, 'name', student.name);
        setFormValue(form, 'studentId', student.studentId);
        setFormValue(form, 'className', student.className);
        form.hidden = false;
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    if (action === 'student-view') {
        const student = window.cbtApp.students.find(entry => String(entry.id) === id);
        const studentKey = `id:${String(student && (student.studentId || student.id) || id).toLowerCase()}`;
        const attempts = window.cbtApp.attempts.filter(attempt => attempt.studentKey === studentKey || attempt.studentId === (student && student.studentId));
        if (student) alert(`${student.name}\nID: ${student.studentId}\nClass: ${student.className}\nAttempts: ${attempts.length}`);
        return;
    }
    if (action === 'student-reset') {
        const student = window.cbtApp.students.find(entry => String(entry.id) === id);
        if (!student) return;
        const key = `id:${String(student.studentId || student.id).toLowerCase()}`;
        const related = window.cbtApp.attempts.filter(attempt =>
            attempt.studentKey === key ||
            String(attempt.studentId || '').trim().toLowerCase() === String(student.studentId || student.id).trim().toLowerCase()
        );
        if (!related.length) return showAdminNotice('No attempts are recorded for this student.');
        const selection = related.length === 1
            ? '1'
            : prompt(`Choose the exam attempt to reset:\n${related.map((attempt, index) => `${index + 1}. ${attempt.subjectName || attempt.subjectId} (${attempt.status})`).join('\n')}`);
        if (selection === null) return;
        const selectedAttempt = related[Number(selection) - 1];
        if (!selectedAttempt) return showAdminNotice('Enter a valid attempt number.', true);
        if (!confirm(`Reset ${student.name}'s ${selectedAttempt.subjectName || 'exam'} attempt?`)) return;
        removeAttempt(selectedAttempt.id);
        renderAdminPage();
        return;
    }
    if (action === 'student-delete') {
        const student = window.cbtApp.students.find(entry => String(entry.id) === id);
        if (!student || !confirm(`Remove ${student.name} from the student list? Existing result history will remain.`)) return;
        window.cbtApp.students = window.cbtApp.students.filter(entry => String(entry.id) !== id);
        saveAdminData('students');
        renderAdminPage();
        return;
    }
    if (action === 'new-question') {
        const form = adminRoot.querySelector('[data-form="question"]');
        form.reset();
        form.elements.namedItem('originalIndex').value = '';
        form.hidden = false;
        return;
    }
    if (action === 'question-edit') {
        const question = window.cbtApp.questions[button.dataset.subject]?.[button.dataset.level]?.[Number(button.dataset.index)];
        const form = adminRoot.querySelector('[data-form="question"]');
        if (!question || !form) return;
        setFormValue(form, 'originalIndex', `${button.dataset.subject}|${button.dataset.level}|${button.dataset.index}`);
        setFormValue(form, 'question', question.q);
        question.opts.forEach((option, index) => setFormValue(form, `option${index}`, option));
        setFormValue(form, 'subjectId', button.dataset.subject);
        setFormValue(form, 'difficulty', button.dataset.level);
        setFormValue(form, 'answer', question.ans);
        form.hidden = false;
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    if (action === 'question-delete') {
        if (!confirm('Delete this question?')) return;
        const list = window.cbtApp.questions[button.dataset.subject]?.[button.dataset.level];
        if (!Array.isArray(list)) return;
        list.splice(Number(button.dataset.index), 1);
        saveAdminData('questions');
        renderAdminPage();
        return;
    }
    if (action === 'new-subject') {
        const form = adminRoot.querySelector('[data-form="subject"]');
        form.reset();
        form.elements.namedItem('id').value = '';
        form.elements.namedItem('durationMinutes').value = window.cbtApp.settings.defaultDuration;
        adminClassOptions.forEach((className, index) => {
            const input = form.elements.namedItem(`timer_${index}`);
            if (input) input.value = window.cbtApp.settings.defaultDuration;
        });
        form.hidden = false;
        return;
    }
    if (action === 'subject-edit') {
        const subject = window.cbtApp.subjects.find(entry => entry.id === id);
        const form = adminRoot.querySelector('[data-form="subject"]');
        if (!subject || !form) return;
        const timers = getSubjectTimerMap(subject);
        setFormValue(form, 'id', subject.id);
        setFormValue(form, 'name', subject.name);
        setFormValue(form, 'durationMinutes', subject.durationMinutes || window.cbtApp.settings.defaultDuration);
        setFormValue(form, 'className', subject.className || normalizeAdminClass(adminClassOptions[0]));
        setFormValue(form, 'instructions', subject.instructions);
        adminClassOptions.forEach((className, index) => {
            const input = form.elements.namedItem(`timer_${index}`);
            if (input) input.value = timers[className] || subject.durationMinutes || window.cbtApp.settings.defaultDuration;
        });
        form.elements.namedItem('isEnabled').checked = Boolean(subject.isEnabled);
        form.hidden = false;
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    if (action === 'subject-toggle') {
        window.cbtApp.subjects = window.cbtApp.subjects.map(subject =>
            subject.id === id ? { ...subject, isEnabled: !subject.isEnabled } : subject
        );
        saveAdminData('subjects');
        window.cbtApp.refreshStudentSubjects();
        renderAdminPage();
        return;
    }
    if (action === 'subject-delete') {
        const subject = window.cbtApp.subjects.find(entry => entry.id === id);
        if (!subject || !confirm(`Remove ${subject.name}? Existing attempts remain in the records.`)) return;
        window.cbtApp.subjects = window.cbtApp.subjects.filter(entry => entry.id !== id);
        window.cbtApp.removedSubjects = [...new Set(window.cbtApp.removedSubjects.concat(id))];
        delete window.cbtApp.questions[id];
        delete window.cbtApp.topicNames[id];
        saveAdminData('subjects');
        saveAdminData('removedSubjects');
        saveAdminData('questions');
        window.cbtApp.refreshStudentSubjects();
        renderAdminPage();
        return;
    }
    if (action === 'attempt-view') {
        const attempt = window.cbtApp.attempts.find(entry => entry.id === id);
        if (attempt) alert(`${attempt.studentName}\n${attempt.className} — ${attempt.subjectName || attempt.subjectId}\nStatus: ${attempt.status}\nScore: ${attempt.score || 0}/${attempt.totalQuestions || 0}\nTime: ${attempt.timeUsed || '--'}`);
        return;
    }
    if (action === 'attempt-reset' || action === 'attempt-delete') {
        const attempt = window.cbtApp.attempts.find(entry => entry.id === id);
        if (!attempt || !confirm(`${action === 'attempt-reset' ? 'Reset' : 'Delete'} ${attempt.studentName}'s ${attempt.subjectName || 'exam'} attempt?`)) return;
        removeAttempt(id);
        renderAdminPage();
        return;
    }
    if (action === 'attempt-complete') {
        const attempt = window.cbtApp.attempts.find(entry => entry.id === id);
        if (!attempt) return;
        const completedAttempt = { ...attempt, status: 'Completed', dateCompleted: new Date().toISOString() };
        window.cbtApp.attempts = window.cbtApp.attempts.map(entry => entry.id === id ? completedAttempt : entry);
        window.cbtApp.results = window.cbtApp.results.filter(result => result.id !== id).concat(buildResultFromAttempt(completedAttempt));
        // 'attempts' and 'results' are the same Firestore collection, so one save
        // covers both views.
        saveAdminData('attempts');
        renderAdminPage();
        return;
    }
    if (action === 'attempt-edit') {
        const attempt = window.cbtApp.attempts.find(entry => entry.id === id);
        if (!attempt) return;
        if (!Number.isInteger(Number(attempt.totalQuestions)) || Number(attempt.totalQuestions) < 1) {
            return showAdminNotice('This attempt has no valid question total to edit.', true);
        }
        const enteredScore = prompt(`Enter score from 0 to ${attempt.totalQuestions || 0}`, String(attempt.score || 0));
        if (enteredScore === null) return;
        const newScore = Number(enteredScore);
        if (!Number.isInteger(newScore) || newScore < 0 || newScore > Number(attempt.totalQuestions)) {
            return showAdminNotice('Enter a whole-number score within the total question count.', true);
        }
        const editedAttempt = {
            ...attempt,
            score: newScore,
            percentage: Math.round(newScore / Number(attempt.totalQuestions) * 100),
            status: 'Completed',
            dateCompleted: attempt.dateCompleted || new Date().toISOString()
        };
        window.cbtApp.attempts = window.cbtApp.attempts.map(entry => entry.id === id ? editedAttempt : entry);
        window.cbtApp.results = window.cbtApp.results.filter(result => result.id !== id).concat(buildResultFromAttempt(editedAttempt));
        saveAdminData('attempts');
        renderAdminPage();
        return;
    }
});

adminRoot.addEventListener('input', event => {
    const target = event.target;
    if (target.dataset.search === 'students') {
        studentSearch = target.value;
        const cursor = target.selectionStart;
        renderAdminPage();
        const replacement = adminRoot.querySelector('[data-search="students"]');
        replacement.focus();
        replacement.setSelectionRange(cursor, cursor);
    } else if (target.dataset.search === 'questions') {
        questionSearch = target.value;
        const cursor = target.selectionStart;
        renderAdminPage();
        const replacement = adminRoot.querySelector('[data-search="questions"]');
        replacement.focus();
        replacement.setSelectionRange(cursor, cursor);
    } else if (target.dataset.resultFilter === 'search') {
        resultFilters.search = target.value;
        const cursor = target.selectionStart;
        renderAdminPage();
        const replacement = adminRoot.querySelector('[data-result-filter="search"]');
        replacement.focus();
        replacement.setSelectionRange(cursor, cursor);
    }
});

adminRoot.addEventListener('change', event => {
    const target = event.target;
    if (target.dataset.filter === 'question-subject') {
        questionSubjectFilter = target.value;
        renderAdminPage();
    }
    if (target.dataset.resultFilter && target.dataset.resultFilter !== 'search') {
        resultFilters[target.dataset.resultFilter] = target.value;
        renderAdminPage();
    }
});

adminRoot.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.target;
    // The submit handler is async (Firebase sign-in and Firestore writes), so
    // read the FormData synchronously before any await.
    const values = new FormData(form);

    if (form.dataset.form === 'login') {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;
        handleAdminLogin(values.get('username'), values.get('password'));
        return;
    }
    if (form.dataset.form === 'student') {
        handleStudentForm(values);
        return;
    }
    if (form.dataset.form === 'question') {
        const subjectId = String(values.get('subjectId'));
        const difficulty = String(values.get('difficulty'));
        const question = {
            q: String(values.get('question')).trim(),
            opts: [0, 1, 2, 3].map(index => String(values.get(`option${index}`)).trim()),
            ans: Number(values.get('answer'))
        };
        if (!question.q || question.opts.some(option => !option) || !Number.isInteger(question.ans) || question.ans < 0 || question.ans > 3) {
            return showAdminNotice('Complete the question, four options, and correct answer.', true);
        }
        const original = String(values.get('originalIndex') || '');
        if (original) {
            const [oldSubject, oldLevel, oldIndex] = original.split('|');
            const oldQuestions = window.cbtApp.questions[oldSubject][oldLevel];
            oldQuestions.splice(Number(oldIndex), 1);
        }
        if (!window.cbtApp.questions[subjectId]) window.cbtApp.questions[subjectId] = {};
        if (!Array.isArray(window.cbtApp.questions[subjectId][difficulty])) window.cbtApp.questions[subjectId][difficulty] = [];
        window.cbtApp.questions[subjectId][difficulty].push(question);
        saveAdminData('questions');
        window.cbtApp.refreshStudentSubjects();
        renderAdminPage();
        showAdminNotice('Question saved.');
        return;
    }
    if (form.dataset.form === 'subject') {
        const originalId = String(values.get('id') || '');
        const name = String(values.get('name')).trim();
        const durationMinutes = Number(values.get('durationMinutes'));
        const className = normalizeAdminClass(values.get('className') || '');
        if (!name || !Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 300) {
            return showAdminNotice('Enter a subject name and a duration from 1 to 300 minutes.', true);
        }
        const id = originalId || name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') ||
            `subject_${Date.now()}`;
        if (!originalId && window.cbtApp.subjects.some(subject => subject.id === id)) {
            return showAdminNotice('A subject with this name already exists.', true);
        }
        const timers = readSubjectTimersFromForm(values);
        if (className && Number.isInteger(durationMinutes) && durationMinutes >= 1 && durationMinutes <= 300) {
            timers[className] = durationMinutes;
        }
        const subject = {
            id,
            name,
            durationMinutes,
            className,
            timers: Object.keys(timers).length ? timers : undefined,
            isEnabled: values.get('isEnabled') === 'on',
            instructions: String(values.get('instructions')).trim() || window.cbtApp.settings.examInstructions
        };
        window.cbtApp.subjects = originalId
            ? window.cbtApp.subjects.map(entry => entry.id === id ? subject : entry)
            : window.cbtApp.subjects.concat(subject);
        if (!originalId) {
            window.cbtApp.questions[id] = { easy: [], medium: [], hard: [] };
            window.cbtApp.removedSubjects = window.cbtApp.removedSubjects.filter(removedId => removedId !== id);
        }
        window.cbtApp.topicNames[id] = name;
        saveAdminData('subjects');
        if (!originalId) {
            saveAdminData('questions');
            saveAdminData('removedSubjects');
        }
        window.cbtApp.refreshStudentSubjects();
        renderAdminPage();
        showAdminNotice('Subject saved.');
        return;
    }
    if (form.dataset.form === 'settings') {
        const defaultDuration = Number(values.get('defaultDuration'));
        const numberOfQuestions = Number(values.get('numberOfQuestions'));
        const passingScore = Number(values.get('passingScore'));
        if (!Number.isInteger(defaultDuration) || defaultDuration < 1 || defaultDuration > 300 ||
            !Number.isInteger(numberOfQuestions) || numberOfQuestions < 5 || numberOfQuestions > 60 ||
            !Number.isInteger(passingScore) || passingScore < 0 || passingScore > 100) {
            return showAdminNotice('Check the duration, question count, and passing score values.', true);
        }
        window.cbtApp.settings = {
            schoolName: String(values.get('schoolName')).trim(),
            platformName: String(values.get('platformName')).trim(),
            defaultDuration,
            numberOfQuestions,
            passingScore,
            allowResults: values.get('allowResults') === 'on',
            examInstructions: String(values.get('examInstructions')).trim()
        };
        saveAdminData('settings');
        document.getElementById('numQuestions').value = String(numberOfQuestions);
        window.cbtApp.refreshBranding();
        window.cbtApp.refreshDurationPreview();
        renderAdminPage();
        showAdminNotice('Settings saved.');
    }
});

// ---------------------------------------------------------------------------
// Firebase session handling
// ---------------------------------------------------------------------------
// Keeps the panel's logged-in state in sync with the real Firebase session.
// If the session ends anywhere (expiry, sign-out in another tab), the panel
// drops back to the login screen and the admin-only in-memory data is cleared,
// so results cannot be left on screen after sign-out.
if (window.cbtBackend) {
    window.cbtBackend.onAuthChange((user) => {
        if (user) return;
        if (!adminLoggedIn) return;
        adminLoggedIn = false;
        window.cbtApp.students = [];
        window.cbtApp.attempts = [];
        window.cbtApp.results = [];
        if (!adminRoot.hidden) showAdminLogin('Your session has ended. Please sign in again.');
    });
}
