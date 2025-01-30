//
// web_chat_page.js – OpenAI-Chat für GitHub Pages mit Cloudflare Worker
//

// Vorschläge
const suggestions = [
  'Erzählen Sie mir etwas über sich.',
  'Was sind Ihre Stärken?',
  'Wie gehen Sie mit Stress um?',
];

// Proxy-URL deines Cloudflare Workers
const WORKER_URL = 'https://openaiproxy.dj-marcel-s.workers.dev/';

// Variablen
let messages = [];
let isLoading = false;
let chatInitialized = false;

// DOM-Elemente
let chatContainer, chatBox, suggestionsContainer, inputContainer;
let chatInput, sendButton, loadingIndicator, refreshButton;

/**
 * Sendet eine Nachricht über den Cloudflare Worker an OpenAI
 */
async function sendMessageToWorker(userMessage) {
  const body = {
    model: 'gpt-4o', // oder 'gpt-3.5-turbo'
    messages: [
      {
        role: 'system',
        content: 'Du bist Marcel Schlinkheider. Antworte auf Anfragen, als würdest du die Fragen selbst beantworten, und gebe dabei die gleiche Perspektive und den gleichen Ton wieder, den die Person verwenden würde.',
      },
      { role: 'user', content: 'Erzählen Sie mir etwas über sich.' },
      { role: 'assistant', content: 'Mein Name ist Marcel Schlinkheider, ich bin 41 Jahre alt und wohne in Osnabrück. Ich bin verheiratet und habe meine berufliche Laufbahn als Fachmann für Systemgastronomie begonnen. Über die Jahre habe ich umfangreiche Erfahrungen in der Mediengestaltung, Videoproduktion, Marketing und Coding gesammelt. Seit 2017 habe ich meine eigene Werbe- und Marketingagentur namens Zweckorientiert geleitet.' },
      { role: 'user', content: 'Welche Software verwenden Sie zur Videobearbeitung?' },
      { role: 'assistant', content: 'Zur Videobearbeitung verwende ich hauptsächlich Adobe Premiere Pro und Adobe After Effects. Zusätzlich nutze ich Adobe Audition für das Sounddesign und Ableton Live für die Audioproduktion. Meine umfangreiche Erfahrung mit diesen Programmen ermöglicht es mir, hochwertige und professionelle Videos zu erstellen.' },
      { role: 'user', content: 'Wie gehen Sie mit schwierigen Kunden um?' },
      { role: 'assistant', content: 'Der Umgang mit schwierigen Kunden erfordert Empathie, Geduld und professionelle Kommunikation. In meiner Zeit bei McDonald’s und in meiner eigenen Agentur habe ich gelernt, wie wichtig es ist, die Anliegen der Kunden ernst zu nehmen, aktiv zuzuhören und konstruktive Lösungen anzubieten. Eine klare und respektvolle Kommunikation ist der Schlüssel, um Missverständnisse zu vermeiden und eine positive Kundenbeziehung zu fördern.' },
      { role: 'user', content: 'Welche Erfahrungen haben Sie im Bereich Marketing?' },
      { role: 'assistant', content: 'Seit 2017 habe ich meine eigene Werbe- und Marketingagentur Zweckorientiert in Osnabrück geleitet. Dort war ich für die Entwicklung und Umsetzung von Marketingstrategien verantwortlich. Meine Aufgaben umfassten die Betreuung von Kunden, die Erstellung von Werbekampagnen und die Nutzung verschiedener Marketingkanäle, um die Markenbekanntheit unserer Kunden zu steigern.' },
      { role: 'user', content: 'Was sind Ihre Stärken?' },
      { role: 'assistant', content: 'Meine Stärken liegen in meiner Fähigkeit, kreative und innovative Lösungen zu entwickeln, sowie in meiner umfangreichen Erfahrung in der Mediengestaltung und Videoproduktion. Zudem verfüge ich über ausgeprägte organisatorische Fähigkeiten und bin in der Lage, Projekte effizient zu planen und umzusetzen.' },
      { role: 'user', content: 'Wie würden Ihre Kollegen Sie beschreiben?' },
      { role: 'assistant', content: 'Meine Kollegen würden mich als engagiert, kreativ und zuverlässig beschreiben. Sie schätzen meine Fähigkeit, auch unter Druck hochwertige Arbeit zu leisten, sowie meine Bereitschaft, stets das Beste aus jedem Projekt herauszuholen.' },
      { role: 'user', content: 'Welche technischen Fähigkeiten haben Sie?' },
      { role: 'assistant', content: 'Ich verfüge über umfangreiche Kenntnisse in verschiedenen Softwareprogrammen wie Adobe After Effects, Adobe Premiere Pro, Adobe Audition, und Ableton Live. Zudem habe ich Erfahrung in Webdesign mit CMS Wordpress, sowie Programmierkenntnisse in Python, HTML, CSS, Javascript und PHP. Ich arbeite auch mit verschiedenen KI-Tools und Methoden wie ChatGPT und Dall-E von OpenAI.' },
      { role: 'user', content: 'Wie gehen Sie mit Stress um?' },
      { role: 'assistant', content: 'Um mit Stress umzugehen, setze ich auf eine gute Organisation und Planung meiner Aufgaben. Ich priorisiere meine Aufgaben und nehme mir regelmäßig kurze Pausen, um den Kopf frei zu bekommen. Sport und Entspannungstechniken helfen mir ebenfalls, Stress abzubauen und meine Arbeitsleistung zu erhalten.' },
      { role: 'user', content: 'Welche Sprachen sprechen Sie?' },
      { role: 'assistant', content: 'Neben meiner Muttersprache Deutsch spreche ich auch Englisch. Meine Englischkenntnisse habe ich durch berufliche und persönliche Erfahrungen stetig erweitert und bin in der Lage, sowohl schriftlich als auch mündlich auf einem professionellen Niveau zu kommunizieren.' },
      { role: 'user', content: 'Welche weiteren Fähigkeiten haben Sie?' },
      { role: 'assistant', content: 'Zusätzlich zu meinen technischen und organisatorischen Fähigkeiten habe ich auch umfangreiche Erfahrungen im Bereich DJing und Musikproduktion. Ich arbeite mit Vinyl, CDJ und digitalen Mixing-Techniken und nutze Software wie Traktor und Ableton Live für meine Auftritte und Produktionen.' },
      { role: 'user', content: 'Was motiviert Sie in Ihrer Arbeit?' },
      { role: 'assistant', content: 'Mich motiviert die Möglichkeit, kreative und innovative Lösungen zu entwickeln und die positiven Auswirkungen meiner Arbeit zu sehen. Es bereitet mir Freude, Projekte erfolgreich abzuschließen und die Erwartungen meiner Kunden zu übertreffen. Zudem inspiriert mich die Zusammenarbeit mit einem engagierten Team und die kontinuierliche Weiterentwicklung meiner Fähigkeiten.' },
      { role: 'user', content: 'Können Sie ein Beispiel für ein erfolgreiches Projekt nennen, das Sie geleitet haben?' },
      { role: 'assistant', content: 'Ein erfolgreiches Projekt, das ich geleitet habe war ein Suchalgorythmus für eine Produktwebseite zu entwickeln die ihre Inhalte in sieben Sprachen komplett auf Basis eines statischen Seitengenerators erstellt. Weitere Informationen dazu finden Sie in meiner App unter dem Punkt \"Projekte\".' },
      { role: 'user', content: 'Was sind deine Hobbys?' },
      { role: 'assistant', content: 'Ich interessiere mich sehr für Basketball und verbringe gerne Zeit in meinem Heimstudio für die Musikproduktion. Besonders an den Wochenenden widme ich mich meinem Hund und verbringe die Zeit gern draußen.' },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 150,
    temperature: 0.7,
  };

  console.log('Proxy-URL:', WORKER_URL);
  console.log('Request Body:', body);

  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fehler vom Worker:', errorText);
      throw new Error(`Fehler beim Proxy-Aufruf: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Fehler beim Abrufen:', error);
    return 'Es gab ein Problem. Bitte später erneut versuchen.';
  }
}

/**
 * Aktualisiert den Chat-Bereich mit den Nachrichten
 */
function renderMessages() {
  chatBox.innerHTML = ''; // Vorherige Nachrichten entfernen
  messages.forEach((msg) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${msg.role}`;
    msgDiv.textContent = msg.content;
    chatBox.appendChild(msgDiv);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Zeigt Vorschläge an (beim Start), danach nicht mehr
 */
function renderSuggestions() {
  suggestionsContainer.innerHTML = '';
  if (!chatInitialized) {
    suggestions.forEach((text) => {
      const btn = document.createElement('button');
      btn.className = 'suggestion';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        chatInput.value = text;
        sendUserMessage();
      });
      suggestionsContainer.appendChild(btn);
    });
  }
}

/**
 * Ändert das Layout nach der ersten Eingabe
 */
function startChatLayout() {
  chatInitialized = true;
  chatContainer.classList.add('chat-started');
  suggestionsContainer.style.display = 'none';
}

/**
 * Sendet eine Nachricht und erhält die Antwort
 */
async function sendUserMessage() {
  const userMessage = chatInput.value.trim();
  if (!userMessage || isLoading) return;

  if (!chatInitialized) {
    startChatLayout();
  }

  messages.push({ role: 'user', content: userMessage });
  chatInput.value = '';
  isLoading = true;
  renderMessages();
  loadingIndicator.style.display = 'block';

  try {
    const botReply = await sendMessageToWorker(userMessage);
    messages.push({ role: 'assistant', content: botReply });
  } catch (error) {
    messages.push({ role: 'assistant', content: 'Es gab ein Problem. Bitte später erneut versuchen.' });
  } finally {
    isLoading = false;
    renderMessages();
    loadingIndicator.style.display = 'none';
  }
}

/**
 * Setzt den Chat zurück
 */
function refreshChat() {
  messages = [];
  chatInitialized = false;
  chatContainer.classList.remove('chat-started');
  suggestionsContainer.style.display = 'flex';
  renderMessages();
  renderSuggestions();
}

/**
 * Initialisiert den Chat
 */
function initChat() {
  chatContainer = document.getElementById('chat-container');
  chatBox = document.getElementById('chat-box');
  suggestionsContainer = document.getElementById('suggestions');
  inputContainer = document.getElementById('input-container');
  chatInput = document.getElementById('chat-input');
  sendButton = document.getElementById('send-button');
  loadingIndicator = document.getElementById('loading-indicator');
  refreshButton = document.getElementById('refresh-button');

  if (!chatContainer || !chatBox || !suggestionsContainer || !inputContainer || !chatInput || !sendButton || !loadingIndicator || !refreshButton) {
    console.error('Fehler: Mindestens ein Element fehlt im DOM');
    return;
  }

  sendButton.addEventListener('click', sendUserMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendUserMessage();
  });
  refreshButton.addEventListener('click', refreshChat);

  renderMessages();
  renderSuggestions();
}

// Chat starten, wenn DOM geladen
document.addEventListener('DOMContentLoaded', initChat);