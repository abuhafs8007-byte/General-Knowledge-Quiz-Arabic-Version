const adminRoot = document.getElementById('adminPortal');
const studentApp = document.querySelector('.container');
const adminEntryButton = document.getElementById('openAdminBtn');

// CHANGE ADMIN LOGIN DETAILS HERE. This frontend-only gate is not secure authentication.
const ADMIN_USERNAME = 'ABU HAFS IZZUL-ARAB';
const ADMIN_PASSWORD = '1234567890';

let adminLoggedIn = false;
let adminSection = 'Dashboard';
let studentSearch = '';
let questionSearch = '';
let questionSubjectFilter = '';
let resultFilters = { search: '', student: '', className: '', subject: '', status: '' };
let adminStorageError = false;

const adminSections = ['Dashboard', 'Students', 'Questions', 'Subjects / Exams', 'Attempts', 'Results', 'Settings'];

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

function saveAdminData(key) {
    const saved = key === 'questions'
        ? window.cbtApp.saveQuestions()
        : window.cbtApp.save(key);
    if (!saved) {
        adminStorageError = true;
        showAdminNotice('Could not save changes. Check available browser storage and try again.', true);
        return false;
    }
    adminStorageError = false;
    return true;
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

function showAdminLogin(message = '') {
    adminRoot.innerHTML = `
        <section class="admin-login-card">
            <button type="button" class="admin-back-link" data-action="close-admin">← Back to student exam</button>
            <p class="admin-eyebrow">School CBT System</p>
            <h1>Administrator Login</h1>
            <p class="admin-muted">Use the sample credentials configured in admin.js.</p>
            <div class="admin-security-note">This is only a frontend gate. It does not provide secure authentication.</div>
            <p class="admin-login-error" role="alert">${escapeAdminText(message)}</p>
            <form data-form="login" class="admin-form">
                <label>Username<input name="username" autocomplete="username" required></label>
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
                    <div><span class="admin-eyebrow">School examination management</span>
                        <h1>${escapeAdminText(adminSection)}</h1></div>
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
        <button class="admin-primary-button" type="button" data-action="new-student">Add Student</button></div>
        <div class="admin-toolbar"><input data-search="students" value="${escapeAdminText(studentSearch)}" placeholder="Search name, student ID, or class"></div>
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

function renderQuestions() {
    const matches = allQuestions().filter(item => {
        const subject = window.cbtApp.subjects.find(entry => entry.id === item.subjectId);
        return (!questionSubjectFilter || item.subjectId === questionSubjectFilter) &&
            `${item.question.q} ${subject ? subject.name : item.subjectId}`.toLowerCase().includes(questionSearch.toLowerCase());
    });
    return `<div class="admin-section-heading"><div><h2>Questions</h2><p>Question format remains { q, opts, ans }.</p></div>
        <button class="admin-primary-button" type="button" data-action="new-question">Add Question</button></div>
        <div class="admin-toolbar">
            <input data-search="questions" value="${escapeAdminText(questionSearch)}" placeholder="Search question text">
            <select data-filter="question-subject"><option value="">All subjects</option>${subjectSelectOptions(questionSubjectFilter)}</select>
        </div>
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
            <label>Exam duration (minutes)<input name="durationMinutes" type="number" min="1" max="300" required></label>
            <label>Exam instructions<textarea name="instructions" rows="3"></textarea></label>
            <label class="admin-check-label"><input name="isEnabled" type="checkbox"> Exam enabled for students</label>
            <div class="admin-form-actions"><button class="admin-primary-button" type="submit">Save Subject</button>
                <button class="admin-light-button" type="button" data-action="cancel-form">Cancel</button></div>
        </form>
        <div class="admin-table-wrap"><table><thead><tr><th>Subject</th><th>Questions</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>${window.cbtApp.subjects.map(subject => {
            const count = allQuestions().filter(item => item.subjectId === subject.id).length;
            return `<tr><td>${escapeAdminText(subject.name)}</td><td>${count}</td><td>${escapeAdminText(subject.durationMinutes)} min</td>
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
    showAdminLogin();
}

function closeAdmin(logout = false) {
    if (logout) adminLoggedIn = false;
    adminRoot.hidden = true;
    studentApp.hidden = false;
    studentApp.style.display = '';
    window.cbtApp.refreshStudentSubjects();
}

function removeAttempt(attemptId) {
    window.cbtApp.attempts = window.cbtApp.attempts.filter(attempt => attempt.id !== attemptId);
    window.cbtApp.results = window.cbtApp.results.filter(result => result.id !== attemptId);
    return saveAdminData('attempts') && saveAdminData('results');
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
    if (action === 'navigate') {
        adminSection = button.dataset.section;
        renderAdminPage();
        return;
    }
    if (action === 'cancel-form') {
        const form = button.closest('form');
        if (form) form.hidden = true;
        return;
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
        form.hidden = false;
        return;
    }
    if (action === 'subject-edit') {
        const subject = window.cbtApp.subjects.find(entry => entry.id === id);
        const form = adminRoot.querySelector('[data-form="subject"]');
        if (!subject || !form) return;
        setFormValue(form, 'id', subject.id);
        setFormValue(form, 'name', subject.name);
        setFormValue(form, 'durationMinutes', subject.durationMinutes);
        setFormValue(form, 'instructions', subject.instructions);
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
        saveAdminData('attempts');
        saveAdminData('results');
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
        saveAdminData('results');
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
    const values = new FormData(form);

    if (form.dataset.form === 'login') {
        if (values.get('username') === ADMIN_USERNAME && values.get('password') === ADMIN_PASSWORD) {
            adminLoggedIn = true;
            adminSection = 'Dashboard';
            renderAdminPage();
        } else {
            showAdminLogin('Incorrect username or password.');
        }
        return;
    }
    if (form.dataset.form === 'student') {
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
        window.cbtApp.students = originalId
            ? window.cbtApp.students.map(entry => String(entry.id) === originalId ? student : entry)
            : window.cbtApp.students.concat(student);
        saveAdminData('students');
        if (previousStudent) {
            const previousKey = `id:${String(previousStudent.studentId || previousStudent.id).toLowerCase()}`;
            const updatedKey = `id:${student.studentId.toLowerCase()}`;
            if (previousKey !== updatedKey) {
                window.cbtApp.attempts = window.cbtApp.attempts.map(attempt =>
                    attempt.studentKey === previousKey
                        ? { ...attempt, studentKey: updatedKey, studentId: student.studentId, studentName: student.name, name: student.name, className: student.className, class: student.className }
                        : attempt
                );
                window.cbtApp.results = window.cbtApp.results.map(result =>
                    result.studentKey === previousKey
                        ? { ...result, studentKey: updatedKey, studentId: student.studentId, studentName: student.name, name: student.name, className: student.className, class: student.className }
                        : result
                );
                saveAdminData('attempts');
                saveAdminData('results');
            }
        }
        renderAdminPage();
        showAdminNotice('Student saved.');
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
        if (!name || !Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 300) {
            return showAdminNotice('Enter a subject name and a duration from 1 to 300 minutes.', true);
        }
        const id = originalId || name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') ||
            `subject_${Date.now()}`;
        if (!originalId && window.cbtApp.subjects.some(subject => subject.id === id)) {
            return showAdminNotice('A subject with this name already exists.', true);
        }
        const subject = {
            id,
            name,
            durationMinutes,
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
