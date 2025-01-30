//
// web_chat_page.js – für GitHub Pages + Cloudflare Worker-Proxy
//    mit OpenAI-ähnlicher Animation und deinen voreingestellten Nachrichten
//

/** 
 * Vorschlags-Buttons, die anfänglich angezeigt werden.
 * Sie sind optional. Nach der ersten Nachricht ausgeblendet.
 */
const suggestions = [
  'Erzählen Sie mir etwas über sich.',
  'Was sind Ihre Stärken?',
  'Wie gehen Sie mit Stress um?',
];

/**
 * Hier trägst du die URL deines Cloudflare-Workers ein.
 * Der Worker enthält den API-Key in seinen Env-Variablen.
 */
const WORKER_URL = 'https://openaiproxy.dj-marcel-s.workers.dev/';

// Interne Chat-Daten
let messages = []; // Speichert { role: 'user' | 'assistant', content: '...' }
let isLoading = false;
let showSuggestions = true;
let chatInitialized = false;

// DOM-Elemente (werden in initChat() belegt)
let chatContainer, inputContainer;
let chatInput, sendButton, chatBox, suggestionsContainer, loadingIndicator, refreshButton;

/**
 * Sendet eine Nachricht an den Cloudflare-Worker (Proxy),
 * der die Anfrage an OpenAI weiterleitet.
 * 
 * @param {string} userMessage – Nachricht, die der Nutzer eingibt
 * @returns {string} – Antwort des Chatbots
 */
async function sendMessageToWorker(userMessage) {
  // Request-Body mit deinen statischen Nachrichten + userMessage am Ende
  const body = {
    model: 'gpt-4o', // Oder 'gpt-3.5-turbo', falls gpt-4o nicht freigeschaltet
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

      // ... Hier hängt dein userMessage dran
      { role: 'user', content: userMessage },
    ],
    max_tokens: 150,
    temperature: 0.7,
  };

  console.log('Proxy-URL:', WORKER_URL);
  console.log('Request Body für Worker:', body);

  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fehler-Antwort vom Worker:', errorText);
      throw new Error(`Fehler beim Proxy-Aufruf: ${response.status}`);
    }

    // OpenAI-Result
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Fehler beim Aufruf des Workers:', error);
    throw error;
  }
}

/**
 * Aktualisiert die Chatbox (DOM) anhand der 'messages'-Liste
 */
function renderMessages() {
  chatBox.innerHTML = '';
  messages.forEach((msg) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${msg.role}`;
    messageDiv.textContent = msg.content;
    chatBox.appendChild(messageDiv);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Zeigt/hidet die Vorschläge als Buttons (anfangs sichtbar)
 */
function renderSuggestions() {
  suggestionsContainer.innerHTML = '';
  if (showSuggestions) {
    suggestions.forEach((suggestion) => {
      const suggestionButton = document.createElement('button');
      suggestionButton.textContent = suggestion;
      suggestionButton.className = 'suggestion';
      suggestionButton.addEventListener('click', () => {
        chatInput.value = suggestion;
        sendUserMessage();
      });
      suggestionsContainer.appendChild(suggestionButton);
    });
  }
}

/**
 * Nach erster User-Eingabe:
 * - Eingabefeld + Vorschläge nach unten
 * - Chat Container ändert sich (OpenAI-Style)
 */

async function sendUserMessage() {
  const userMessage = chatInput.value.trim();
  if (!userMessage || isLoading) return;

  // Falls noch keine Nachricht -> Chat layout anpassen
  if (!chatInitialized) {
    chatInitialized = true;
    // Container als 'chat-started' markieren => CSS anpassen
    chatContainer.classList.add('chat-started');
    // Vorschläge ausblenden (optional)
    suggestionsContainer.style.display = 'none';
  }

  // User-Nachricht
  messages.push({ role: 'user', content: userMessage });
  chatInput.value = '';
  isLoading = true;
  renderMessages();
  loadingIndicator.style.display = 'block';

  try {
    const botReply = await sendMessageToWorker(userMessage);
    messages.push({ role: 'assistant', content: botReply });
  } catch (error) {
    messages.push({
      role: 'assistant',
      content: 'Es gab ein Problem beim Abrufen der Antwort. Bitte versuchen Sie es später erneut.',
    });
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
  showSuggestions = true;
  chatInitialized = false;

  // Layout zurücksetzen
  chatContainer.classList.remove('chat-started');
  suggestionsContainer.style.display = 'flex'; // oder 'block', wie du willst

  renderMessages();
  renderSuggestions();
}

/**
 * Initialisiert die Elemente und setzt Event-Listener
 */
function initChat() {
  chatContainer = document.getElementById('chat-container');
  inputContainer = document.getElementById('input-container');

  chatInput = document.getElementById('chat-input');
  sendButton = document.getElementById('send-button');
  chatBox = document.getElementById('chat-box');
  suggestionsContainer = document.getElementById('suggestions');
  loadingIndicator = document.getElementById('loading-indicator');
  refreshButton = document.getElementById('refresh-button');

  if (!chatInput || !sendButton || !chatBox || !suggestionsContainer || !loadingIndicator || !refreshButton || !chatContainer || !inputContainer) {
    console.error('Ein oder mehrere notwendige Elemente fehlen im DOM.');
    return;
  }

  sendButton.addEventListener('click', sendUserMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendUserMessage();
    }
  });
  refreshButton.addEventListener('click', refreshChat);

  // Erster Render
  renderMessages();
  renderSuggestions();
}

// DOM Content Loaded -> initChat
document.addEventListener('DOMContentLoaded', initChat);
