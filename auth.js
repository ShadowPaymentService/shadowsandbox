// auth.js
import { auth, googleProvider, githubProvider } from './firebase-config.js';
import { signInWithPopup, signOut, onAuthStateChanged } from "https://gstatic.com";

// Google Login
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("Logged in:", result.user);
        window.location.href = "dashboard.html"; // After logging in, move to Dashboard
    } catch (error) {
        console.error("Auth Error:", error.message);
        alert("Authentication Failed: " + error.message);
    }
};

// GitHub Login
export const loginWithGithub = async () => {
    try {
        const result = await signInWithPopup(auth, githubProvider);
        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("Auth Error:", error.message);
    }
};

// Listen to user status
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is active:", user.displayName);
        // You can add Dashboard information here.
    } else {
        console.log("No user logged in");
    }
});
