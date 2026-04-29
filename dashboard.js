import { db, auth } from './firebase-config.js';
import { collection, addDoc, query, where, onSnapshot } from "https://gstatic.com";

// Պրոյեկտ ստեղծել և պահել Firestore-ում
window.createProject = async () => {
    const name = document.getElementById('projectName').value;
    const type = document.getElementById('projectType').value;
    const user = auth.currentUser;

    if (!user) return alert("Log in to the system!");
    if (!name) return alert("Name is empty.");

    try {
        await addDoc(collection(db, "projects"), {
            uid: user.uid,
            name: name,
            type: type,
            createdAt: new Date()
        });
        closeModal();
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

// Automatic update of projects from the database
auth.onAuthStateChanged(user => {
    if (user) {
        const q = query(collection(db, "projects"), where("uid", "==", user.uid));
        onSnapshot(q, (snapshot) => {
            const grid = document.getElementById('projectGrid');
            grid.innerHTML = ""; // Clear old
            snapshot.forEach((doc) => {
                const data = doc.data();
                grid.innerHTML += `
                    <div class="project-card">
                        <h3>${data.name}</h3>
                        <p>Tech: ${data.type}</p>
                        <button class="open-btn" onclick="openTerminal('${data.name}')">RUN TERMINAL</button>
                    </div>`;
            });
        });
    } else {
        window.location.href = "index.html";
    }
});
