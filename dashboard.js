import { initializeApp } from "https://gstatic.com";
import { getAuth, onAuthStateChanged, signOut } from "https://gstatic.com";
import { getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp } from "https://gstatic.com";

// --- FIREBASE CONFIG (Enter your details.) ---
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

// 1. Ստուգել օգտատիրոջը
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('userName').innerText = user.displayName || "Hacker_Active";
        document.getElementById('userAvatar').src = user.photoURL || "https://placeholder.com";
        loadProjects(user.uid);
    } else {
        window.location.href = "index.html";
    }
});

// 2. Պրոյեկտների բեռնում Firestore-ից
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
                <p>Environment: ${data.type}</p>
                <button class="open-btn" onclick="startTerminal('${data.name}')">EXECUTE_SHELL</button>
            `;
            grid.appendChild(card);
        });
    });
}

// 3. Պրոյեկտի ստեղծում
document.getElementById('confirmCreate').onclick = async () => {
    const name = document.getElementById('projectName').value;
    const type = document.getElementById('projectType').value;
    const user = auth.currentUser;

    if (name && user) {
        await addDoc(collection(db, "projects"), {
            uid: user.uid,
            name: name,
            type: type,
            timestamp: serverTimestamp()
        });
        document.getElementById('createModal').style.display = 'none';
        document.getElementById('projectName').value = "";
    } else {
        alert("Enter project name!");
    }
};

// 4. Տերմինալի ֆունկցիա (Xterm.js)
window.startTerminal = (name) => {
    const container = document.getElementById('terminal-container');
    container.style.display = 'block';
    
    // Մաքրել հին տերմինալը եթե կա
    document.getElementById('xterm-div').innerHTML = "";
    
    const term = new Terminal({
        cursorBlink: true,
        fontFamily: 'Fira Code',
        theme: { background: '#000', foreground: '#00ff41' }
    });

    term.open(document.getElementById('xterm-div'));
    term.writeln(`\x1b[1;32m>>> Accessing ShadowSandBox...\x1b[0m`);
    term.writeln(`\x1b[1;32m>>> Connecting to ${name} container...\x1b[0m`);
    term.write('\r\n$ ');

    term.onData(data => {
        if (data === '\r') {
            term.write('\r\n\x1b[1;31mError: Execution requires server-side pty-node.\x1b[0m\r\n$ ');
        } else {
            term.write(data);
        }
    });
};

// 5. Logout
document.getElementById('logoutBtn').onclick = () => signOut(auth);
