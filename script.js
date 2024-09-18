document.addEventListener('DOMContentLoaded', function() {
    // Dynamisch den Seitentitel setzen
    document.title = `Lebenslauf - ${personalData.name}`;

    // Profilbild setzen
    const profileImage = personalData.profileImage || 'assets/bild_linkedin.jpg';

    // Tabs und Inhalte generieren
    const tabs = [
        { id: 'profil', label: 'Profil', icon: 'person' },
        { id: 'faehigkeiten', label: 'Fähigkeiten', icon: 'star' },
        { id: 'erfahrung', label: 'Erfahrung', icon: 'work' },
        { id: 'bildung', label: 'Bildung', icon: 'school' },
        { id: 'projekte', label: 'Projekte', icon: 'folder' }
    ];

    const contentDiv = document.querySelector('.content');
    const navTabs = document.getElementById('nav-tabs');

    tabs.forEach((tab, index) => {
        // Navigation Tabs erstellen
        const navItem = document.createElement('li');
        navItem.classList.add('tab-link');
        if (index === 0) navItem.classList.add('active');
        navItem.setAttribute('data-tab', tab.id);
        navItem.innerHTML = `
            <span class="material-icons">${tab.icon}</span>
            <span class="tab-label">${tab.label}</span>
        `;
        navTabs.appendChild(navItem);

        // Tab-Inhalte erstellen
        const tabContent = document.createElement('div');
        tabContent.classList.add('tab-content');
        if (index === 0) tabContent.classList.add('active');
        tabContent.id = tab.id;

        let sectionContent = '';

        switch (tab.id) {
            case 'profil':
                sectionContent = `
                    <section>
                        <h1>${personalData.name}</h1>
                        <img src="${profileImage}" alt="Profilfoto">
                        <p>${personalData.description}</p>
                    </section>
                `;
                break;
            case 'faehigkeiten':
                sectionContent = `
                    <section>
                        ${generateSkillsSection(skillsData)}
                    </section>
                `;
                break;
            case 'Berufspraxis':
                sectionContent = `
                    <section>
                        <h2>Berufspraxis</h2>
                        ${generateExperienceSection(experienceData)}
                    </section>
                `;
                break;
            case 'bildung':
                sectionContent = `
                    <section>
                        <h2>Bildung</h2>
                        ${generateEducationSection(educationData)}
                    </section>
                `;
                break;
            case 'projekte':
                sectionContent = `
                    <section>
                        <h2>Projekte</h2>
                        ${generateProjectsSection(projectsData)}
                    </section>
                `;
                break;
        }

        tabContent.innerHTML = sectionContent;
        contentDiv.appendChild(tabContent);
    });

    // Kontaktinformationen
    const contactInfoDiv = document.querySelector('.contact-info');
    contactInfoDiv.innerHTML = `
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Telefon:</strong> ${contactData.phone}</p>
        <p><strong>LinkedIn:</strong> <a href="${contactData.linkedin}">${personalData.name}</a></p>
    `;

    // Tab-Navigation Funktionalität
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Entferne 'active' Klasse von allen Links
            tabLinks.forEach(function(link) {
                link.classList.remove('active');
            });

            // Füge 'active' Klasse zum angeklickten Link hinzu
            this.classList.add('active');

            // Verstecke alle Tab-Inhalte
            tabContents.forEach(function(content) {
                content.classList.remove('active');
            });

            // Zeige den ausgewählten Tab-Inhalt
            document.getElementById(tabId).classList.add('active');
        });
    });
});

// Funktionen zum Generieren der Inhalte
function generateSkillsSection(skills) {
    let html = '';
    skills.forEach(skillCategory => {
        html += `<h3>${skillCategory.category}</h3><ul>`;
        skillCategory.items.forEach(item => {
            html += `<li>${item}</li>`;
        });
        html += '</ul>';
    });
    return html;
}

function generateExperienceSection(experiences) {
    let html = '';
    experiences.forEach(exp => {
        html += `
            <div class="job">
                <h3>${exp.position}</h3>
                <p><strong>Unternehmen:</strong> ${exp.company}</p>
                <p><strong>Zeitraum:</strong> ${exp.period}</p>
                ${exp.details ? `<p><strong>Details:</strong> ${exp.details}</p>` : ''}
                ${exp.tasks ? `<ul>${exp.tasks.map(task => `<li>${task}</li>`).join('')}</ul>` : ''}
            </div>
        `;
    });
    return html;
}

function generateEducationSection(education) {
    let html = '';
    education.forEach(edu => {
        html += `
            <div class="education">
                <h3>${edu.degree}</h3>
                <p><strong>Institution:</strong> ${edu.institution}</p>
                <p><strong>Zeitraum:</strong> ${edu.period}</p>
                ${edu.details ? `<p><strong>Details:</strong> ${edu.details}</p>` : ''}
            </div>
        `;
    });
    return html;
}

function generateProjectsSection(projects) {
    let html = '';
    projects.forEach(project => {
        html += `
            <div class="project">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                ${project.details ? `<h4>Details</h4><p>${project.details}</p>` : ''}
                ${project.technologies ? `<p><strong>Kenntnisse:</strong> ${project.technologies.join(', ')}</p>` : ''}
            </div>
        `;
    });
    return html;
}
