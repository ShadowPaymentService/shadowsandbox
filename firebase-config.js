import { initializeApp } from "https://gstatic.com";
import { getAuth } from "https://gstatic.com";
import { getFirestore } from "https://gstatic.com";

const firebaseConfig = {
    apiKey: "AIzaSyDpxt8iUQBKODu1VvP4hPHl_LyJQKKvZSQ",
    authDomain: "codesandbox-8272e.firebaseapp.com",
    projectId: "codesandbox-8272e",
    storageBucket: "codesandbox-8272e.firebasestorage.app",
    messagingSenderId: "58218651704",
    appId: "1:58218651704:web:8f42123496a37c768946cd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
