/**
 * Firebase Web configuration for the Arabic CBT platform.
 *
 * ---------------------------------------------------------------------------
 * ACTION REQUIRED BEFORE THE PLATFORM WILL WORK ONLINE
 * ---------------------------------------------------------------------------
 * These values are NOT secrets: a Firebase Web apiKey is a public project
 * identifier and is always readable in any deployed client bundle. The real
 * protection comes from firestore.rules + Firebase Authentication, never from
 * hiding this file.
 *
 * Replace every placeholder below with the values from the Firebase Console of
 * the Arabic project (Project settings -> Your apps -> SDK setup and config),
 * then create the administrator account with the SAME email address that
 * firestore.rules hard-codes (ADMIN_EMAIL) and set a strong password for it.
 *
 * Until these values are filled in, firebase.js keeps the app in an explicit
 * "offline / unconfigured" state: exams and the admin dashboard stay disabled
 * instead of silently falling back to insecure local behaviour.
 */

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Exposed on window as cbtFirebaseConfig, which is exactly what firebase.js reads
// (see hasUsableConfig() and initializeApp() in firebase.js). Keeping it a local
// `const` would leave window.cbtFirebaseConfig undefined and pin the app to the
// "unconfigured" state even when real values are present.
window.cbtFirebaseConfig = {
  apiKey: "AIzaSyCBXJ5Vn4gtsQHRGqFEPSZnbFaYZzaTqxY",
  authDomain: "arabic-cbt-exam-platform.firebaseapp.com",
  projectId: "arabic-cbt-exam-platform",
  storageBucket: "arabic-cbt-exam-platform.firebasestorage.app",
  messagingSenderId: "329961434170",
  appId: "1:329961434170:web:e4b9e9a54530ef2ce71903",
  measurementId: "G-0X1JVR5GMH"
};

/**
 * The single administrator account allowed to read the roster, attempts and
 * results, and to write exam data. Kept in the client only as a *defence in
 * depth* check; the authoritative enforcement is
 * `request.auth.token.email == ADMIN_EMAIL` inside firestore.rules.
 */
window.cbtAdminEmail = 'abuhafs8007@gmail.com';
