// firebase-config.js
import { initializeApp } from "https://gstatic.com";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "https://gstatic.com";
import { getFirestore } from "https://gstatic.com";

const firebaseConfig = {
    apiKey: "AIzaSyDpxt8iUQBKODu1VvP4hPHl_LyJQKKvZSQ",
    authDomain: "codesandbox-8272e.firebaseapp.com",
    projectId: "codesandbox-8272e",
    storageBucket: "codesandbox-8272e.firebasestorage.app",
    messagingSenderId: "58218651704",
    appId: "1:58218651704:web:8f42123496a37c768946cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
