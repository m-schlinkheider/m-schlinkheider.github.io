// Persönliche Daten
const personalData = {
    name: 'Marcel Schlinkheider',
    description: 'Bitte ohne Schnick Schnack.',
    profileImage: 'assets/bild_linkedin.jpg', // Pfad zu Ihrem Profilbild
    ImageVari: 'assets/Marcel_Auschnitt-rund.png',
};

// Kontaktinformationen
const contactData = {
    email: 'marcel_s@me.com',
    phone: '',
    linkedin: 'https://www.linkedin.com/in/marcel-schlinkheider/'
};

// Fähigkeiten
const skillsData = [
    {
        category: 'Persönliche Stärken',
        items: [
            'Problemlösung & Entwicklung',
            'Struktur & Datenhandling',
            'Selbstständiges Arbeiten'
        ]
    },
    {
        category: 'Branchenwissen',
        items: [
            'Künstliche Intelligenz (KI)',
            'Codierung',
            'Entwicklung individuell zugeschnittener CMS',
            'Soziale Medien',
            'Social-Media-Marketing',
            'Visual Storytelling',
            'Videoproduktion',
            'Videoschnitt',
            'Stop-Motion',
            'Keyframe-Animation',
            'Audioschnitt',
            'Animation',
            'Audio-Nachbearbeitung',
            'Projektmanagement',
            'Personalmanagement',
            'Online-Marketing',
            'Webdesign',
            'Wordpress-Design',
            'E-Commerce SEO',
            'Onlinewerbung',
            'Suchmaschinenoptimierung (SEO)'
            // Weitere Punkte hinzufügen
        ]
    },
    {
        category: 'Tools & Technologien',
        items: [
            'Python (Programmiersprache)',
            'Open Source Software',
            'ChatGPT',
            'Midjourney',
            'Udio',
            'HTML',
            'Cascading Style Sheets (CSS)',
            'JavaScript',
            'Wordpress',
            'Content-Managment-System (CMS)',
            'Google Webmaster Tools',
            'Google Analytics',
            'Facebook',
            'Adobe Premiere Pro',
            'Adobe After Effects'
            // Weitere Punkte hinzufügen
        ]
    }
];

// Berufserfahrung
const experienceData = [
    {
        position: 'Selbstständiger Unternehmer',
        company: 'Zweckorientiert. Werbe- und Marketingagentur, Osnabrück',
        period: '21.04.2017 - 15.03.2024',
        details: 'Ausbildungsbetrieb (IHK) seit 2018',
        tasks: [
            'Geschäftsführung',
            'Kundenakquise',
            'Projektmanagment',
        ]
    },
    {
        position: 'Gründungsphase Agentur',
        company: 'Zweckorientiert. Werbe- und Marketingagentur, Osnabrück',
        period: '01.01.2017 - 20.04.2017'
    },
    {
        position: 'Mediengestalter Bild & Ton',
        company: 'Agentur 11XI, Werbeagentur, Bielefeld',
        period: '01.07.2015 - 31.12.2016',
        tasks: [
            'Videoproduktion',
            'Sounddesign',
            'Audiodesign',
        ]    
    },
    {
        position: 'Leitender Angestellter Fachmann für Systemgastronomie',
        company: 'Systemgastronomie Christian Eckstein GmbH & Co. KG, McDonald´s Deutschland, Osnabrück',
        period: '01.02.2009 - 30.06.2015',
        tasks: [
            'Geschäftskorrespondenz', 
            'Kundenbetreuung & Beschwerdemanagement', 
            'Umsatz- und Personalplanung, Koordination der Warenwirtschaft',
        ]    
    },
    {
        position: 'Angestellt bei',
        company: 'Systemgastronomie Ziemek GmbH, McDonald´s Deutschland, Osnabrück',
        period: '16.01.2006 - 31.07.2006',
        details: 'Mitarbeiter im Restaurant'
    }
    // Weitere Berufserfahrungen hinzufügen
];

// Bildung
const educationData = [
    {
        category: 'Berufliche Ausbildung',
        entries: [
    {
        degree: 'Fachmann für Systemgastronomie',
        institution: 'Systemgastronomie Christian Eckstein GmbH & Co. KG, McDonald\'s Deutschland, Osnabrück',
        period: '01.08.2006 - 22.01.2009',
        details: 'Abschluss als Fachmann für Systemgastronomie'
    },
    {
        degree: 'IT-Systemkaufmann',
        institution: 'Wortmann AG',
        period: '01.08.2003 - 21.07.2004',
        details: 'Auszubildender'
    }    
    // Weitere Bildungsabschlüsse hinzufügen
  ]
},
{
    category: 'Zivildienst',
    entries: [
        {
            degree: 'Zivildienstleistender',
            institution: 'Schloss Varenholz GmbH',
            period: '04.04.2005 - 31.12.2005',
            details: 'Internatsgesellschaft für Kinder- und Jugendhilfe'
        }
        // Weitere Einträge hinzufügen
    ]
},
{
    category: 'Schulausbildung',
    entries: [
        {
            degree: 'Schüler',
            institution: 'Berufsschulzentrum am Westerberg',
            period: '01.08.2006 - 22.01.2009',
            details: 'Abschluss als Fachmann für Systemgastronomie'
        },
        {
            degree: 'Schüler',
            institution: 'Berufskolleg Lübbecke des Kreises Minden-Lübbecke',
            period: '15.09.2003 -21.07.2004',
            details: 'Fachbereich IT-Systemkaufmann'
        },
        {
            degree: 'Schüler',
            institution: 'Städtische Hauptschule Meierfeld, Herford',
            period: '2000-2002',
            details: 'Abschluss Sekundarstufe I'
        },
        {
            degree: 'Schüler',
            institution: 'Königin-Mathilde-Gymnasium der Stadt Herford',
            period: '1994 -2000'
        }
        // Weitere Einträge hinzufügen
    ]
}
];  

// Projekte
const projectsData = [
    {
      category: 'Entwicklung/Automatisierung',
      projects: [
       {   
        title: 'Automatisierung für die Auswertung von Umfragen aus LimeSurvey',
        description: 'Dieses Projekt bietet eine vollständige Automatisierungslösung zur Auswertung von Umfragen, die mit LimeSurvey durchgeführt wurden.',
        details: 'Die Lösung umfasst Module und Skripte für die Datenextraktion, -verarbeitung, -aggregation und -darstellung.',
        technologies: ['Codierung', 'Python', 'Künstliche Intelligenz', 'Open Source Software', 'Projektmanagement', 'HTML', 'CSS', 'JavaScript', 'ChatGPT'],
        image: 'assets/automat.webp', // Pfad zum Bild
        link: 'https://umfrage.resilientfutures.science/index.php/255946?lang=de'
    },
    {
        title: 'Suchfunktion für mehrsprachige Webseite',
        description: 'Implementierung einer leistungsstarken Suchfunktion für eine mehrsprachige Webseite, die in sieben Sprachen angeboten wird und über einen statischen Seitengenerator läuft.',
        details: 'Die Suchfunktion verbessert die Benutzerfreundlichkeit und Zugänglichkeit der Webseite erheblich und optimiert die digitale Kundenerfahrung.',
        technologies: ['JSON', 'JavaScript', 'CSS', 'Stylus', 'Analytische Fähigkeiten', 'PugJS', 'HTML', 'Algorithmen', 'Künstliche Intelligenz', 'Projektplanung', 'Codierung', 'ChatGPT'],
        image: 'assets/projekt2.jpg', // Pfad zum Bild
        link: 'https://www.bunny-nature.de'
    }
  ]
},
{
     category: 'Webentwicklung',
     projects: [
        {
            title: 'Webseite & B2B Shop',
            description: 'Ein Website die sowohl auf einem Magalog aufbaut um die Produktvielfalt und Möglichkeiten darzulegen. Als auch einen B2B Shop inkl. internen Anmeldung und Nutzung. Jeweils mit angepassten Benutzeroberflächen. Eine Vielzahl an Varianten und Möglichkeiten der Produktkonfiguration mussten hier ebenfalls eingebunden werden',
            details: '',
            technologies: ['Webdesign', 'Wordpress-Design', 'Suchmaschinenoptimierung (SEO)'],
            image: 'assets/OSSTEC.jpg', // Pfad zum Bild
            link: 'https://www.osstec.de'
        },
        {
            title: 'Stiftungs Webseite m. Spendenfunktionen',
            description: 'Zudem war es hier wichtig eine Frontend Struktur und ein individuelles und einfaches Backend zu entwickeln. Sodass ein weiterer Nutzer auf einfache Weise Inhalte in Formularfelder eintragen und Dateien hochladen kann. Diese dann ohne weiteres Zutun des Nutzers an jeweils richtigen Stellen auf der Seite landen. Je nachdem als was der Inhalt markiert wird',
            details: '',
            technologies: ['Webdesign', 'Wordpress-Design', 'Suchmaschinenoptimierung (SEO)'],
            image: 'assets/augenblicke.png', // Pfad zum Bild
            link: 'https://www.stiftung-augenblicke.de'
        }
     ]
}  
    // Weitere Projekte hinzufügen
];
