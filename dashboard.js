// Մոդալ պատուհանների կառավարում
function openModal() { document.getElementById('createModal').style.display = 'flex'; }
function closeModal() { document.getElementById('createModal').style.display = 'none'; }
function toggleSettings() { 
    const modal = document.getElementById('settingsModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// Պրոյեկտի ստեղծում
function createProject() {
    const name = document.getElementById('projectName').value;
    const type = document.getElementById('projectType').value;
    
    if(name === "") { alert("SYSTEM_ERROR: Name required"); return; }

    const grid = document.getElementById('projectGrid');
    const newProject = document.createElement('div');
    newProject.className = 'project-card';
    newProject.innerHTML = `
        <h3>${name}</h3>
        <p>Type: ${type.toUpperCase()}</p>
        <button class="open-btn">INITIALIZING TERMINAL...</button>
    `;
    
    grid.appendChild(newProject);
    closeModal();
    console.log(`Project ${name} created with type ${type}`);
}

// Բաժինների փոփոխություն
function showSection(section) {
    document.getElementById('sectionTitle').innerText = section.toUpperCase() + "_LOGS";
}

// Email Verification (Real concept)
function verifyEmail() {
    const email = document.getElementById('editEmail').value;
    alert("Verification link sent to: " + email);
}
