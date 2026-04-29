import { initializeApp } from "https://gstatic.com";
import { getAuth, onAuthStateChanged, signOut, sendEmailVerification, updateProfile } from "https://gstatic.com";
import { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp } from "https://gstatic.com";

// --- FIREBASE CONFIG ---
const firebaseConfig = {
    apiKey: "AIzaSyDpxt8iUQBKODu1VvP4hPHl_LyJQKKvZSQ",
    authDomain: "codesandbox-8272e.firebaseapp.com",
    projectId: "codesandbox-8272e",
    storageBucket: "codesandbox-8272e.firebasestorage.app",
    messagingSenderId: "58218651704",
    appId: "1:58218651704:web:8f42123496a37c768946cd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentMode = 'new';

// 1. Auth Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('userName').innerText = user.displayName || "Hacker_Active";
        document.getElementById('userAvatar').src = user.photoURL || "https://placeholder.com";
        document.getElementById('userStatus').innerText = `verified: ${user.emailVerified}`;
        loadProjects(user.uid);
    } else {
        window.location.href = "index.html";
    }
});

// 2. Load Projects from Firebase Firestore
function loadProjects(uid) {
    const q = query(collection(db, "projects"), where("uid", "==", uid));
    onSnapshot(q, (snapshot) => {
        const grid = document.getElementById('projectGrid');
        grid.innerHTML = "";
        snapshot.forEach((doc) => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h3>${data.name}</h3>
                <p>Type: ${data.type}</p>
                <button class="open-btn" onclick="startTerminal('${data.name}', ${data.isGithub})">EXECUTE_SHELL</button>
            `;
            grid.appendChild(card);
        });
    });
}

// 3. Create/Clone Project
document.getElementById('confirmCreate').onclick = async () => {
    const user = auth.currentUser;
    let name, type, isGithub = false;

    if (currentMode === 'git') {
        const url = document.getElementById('githubRepoUrl').value;
        if (!url.includes('github.com')) return alert("Invalid GitHub URL");
        name = url.split('/').pop();
        type = "GitHub Repository";
        isGithub = true;
    } else {
        name = document.getElementById('projectName').value;
        type = document.getElementById('projectType').value;
    }

    if (name && user) {
        await addDoc(collection(db, "projects"), {
            uid: user.uid,
            name: name,
            type: type,
            isGithub: isGithub,
            timestamp: serverTimestamp()
        });
        closeModal();
    }
};

// 4. Terminal Engine (Xterm.js)
window.startTerminal = (name, isGit) => {
    const container = document.getElementById('terminal-container');
    container.style.display = 'block';
    document.getElementById('xterm-div').innerHTML = "";
    
    const term = new Terminal({ cursorBlink: true, theme: { background: '#000', foreground: '#00ff41' } });
    term.open(document.getElementById('xterm-div'));
    
    term.writeln(`\x1b[1;32m>>> Accessing ShadowSandBox Environment...\x1b[0m`);
    if(isGit) {
        term.writeln(`\x1b[1;33m>>> git clone https://github.com{name}.git\x1b[0m`);
        term.writeln(`Receiving objects: 100% (1024/1024), done.`);
    }
    term.writeln(`\x1b[1;32m>>> Container ${name} is ONLINE.\x1b[0m`);
    term.write('\r\n$ ');

    term.onData(data => {
        if (data === '\r') term.write('\r\n\x1b[31mPermission Denied: Root access required.\x1b[0m\r\n$ ');
        else term.write(data);
    });
};

// 5. UI Helpers
window.switchTab = (mode) => {
    currentMode = mode;
    document.getElementById('new-project-tab').style.display = mode === 'new' ? 'block' : 'none';
    document.getElementById('github-tab').style.display = mode === 'git' ? 'block' : 'none';
    document.getElementById('tabNew').className = mode === 'new' ? 'active' : '';
    document.getElementById('tabGit').className = mode === 'git' ? 'active' : '';
};

window.openCreateModal = () => document.getElementById('createModal').style.display = 'flex';
window.closeModal = () => document.getElementById('createModal').style.display = 'none';
window.openSettings = () => document.getElementById('settingsModal').style.display = 'flex';

// 6. Settings Logic (Email/Username)
document.getElementById('verifyBtn').onclick = async () => {
    const user = auth.currentUser;
    if (user) {
        await sendEmailVerification(user);
        alert("Verification email sent to: " + user.email);
    }
};

// 7. Logout
document.getElementById('logoutBtn').onclick = () => signOut(auth);

window.showSection = (section) => {
    document.getElementById('sectionTitle').innerText = `SYSTEM_${section.toUpperCase()}`;
};
