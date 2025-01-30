//
// web_chat_page.js – für GitHub Pages + Cloudflare Worker-Proxy
//

// Vorschlags-Buttons, die für den Nutzer angezeigt werden:
const suggestions = [
  'Erzählen Sie mir etwas über sich.',
  'Was sind Ihre Stärken?',
  'Wie gehen Sie mit Stress um?',
];

// Interne Chat-Daten
let messages = []; // Speichert { role: 'user' | 'assistant', content: '...' }
let isLoading = false;
let showSuggestions = true;

// Hier trägst du die URL deines Cloudflare-Workers ein:
const WORKER_URL = 'https://openaiproxy.dj-marcel-s.workers.dev/'; 

// DOM-Elemente (werden in initChat() belegt)
let chatInput, sendButton, chatBox, suggestionsContainer, loadingIndicator, refreshButton;

/**
 * Sendet eine Nachricht an den Cloudflare-Worker
 * (oder eine andere Proxy-URL), der den API-Key
 * versteckt an OpenAI weiterleitet.
 * 
 * @param {string} userMessage – Nachricht, die der Nutzer eingibt
 * @returns {string} – Antwort des Chatbots
 */
async function sendMessageToWorker(userMessage) {
  // Request-Body, den der Worker später an OpenAI sendet:
  const body = {
    model: 'gpt-4o', // Oder 'gpt-3.5-turbo', falls gpt-4o nicht freigeschaltet
    messages: [
      {
        role: 'system',
        content: 'Du bist Marcel Schlinkheider. Antworte auf Anfragen, als würdest du die Fragen selbst beantworten, und gebe dabei die gleiche Perspektive und den gleichen Ton wieder, den die Person verwenden würde.',
      },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 150,
    temperature: 0.7,
  };

  console.log('Proxy-URL:', WORKER_URL);
  console.log('Request Body für Worker:', body);

  try {
    // Statt direkt an api.openai.com → an den Worker
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

    // Der Worker gibt uns das OpenAI-Resultat zurück
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Fehler beim Aufruf des Workers:', error);
    throw error;
  }
}

/**
 * Aktualisiert die Chatbox (DOM) anhand der "messages"-Liste
 */
function renderMessages() {
  chatBox.innerHTML = ''; // Vorherige Nachrichten entfernen
  messages.forEach((msg) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${msg.role}`;
    messageDiv.textContent = msg.content;
    chatBox.appendChild(messageDiv);
  });
  // Nach unten scrollen
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Zeigt/hidet die Vorschläge als Buttons
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
 * Sendet die Nutzernachricht zum Worker, erhält die Antwort
 * und aktualisiert das UI
 */
async function sendUserMessage() {
  const userMessage = chatInput.value.trim();
  if (!userMessage || isLoading) return;

  // Nutzer-Eingabe in Array ablegen
  messages.push({ role: 'user', content: userMessage });
  chatInput.value = '';
  isLoading = true;
  renderMessages();
  renderSuggestions();
  loadingIndicator.style.display = 'block';

  try {
    // Hier rufen wir unseren Worker an, NICHT OpenAI direkt
    const botReply = await sendMessageToWorker(userMessage);
    messages.push({ role: 'assistant', content: botReply });
  } catch (error) {
    // Bei Fehler: Bot gibt Fehlermeldung aus
    messages.push({
      role: 'assistant',
      content: 'Es gab ein Problem beim Abrufen der Antwort. Bitte versuchen Sie es später erneut.',
    });
  } finally {
    isLoading = false;
    renderMessages();
    renderSuggestions();
    loadingIndicator.style.display = 'none';
  }
}

/**
 * Setzt den Chat zurück (Nachrichten löschen, Vorschläge wieder anzeigen)
 */
function refreshChat() {
  messages = [];
  showSuggestions = true;
  renderMessages();
  renderSuggestions();
}

/**
 * Initialisiert den Chat: DOM-Elemente holen, Events binden
 */
function initChat() {
  chatInput = document.getElementById('chat-input');
  sendButton = document.getElementById('send-button');
  chatBox = document.getElementById('chat-box');
  suggestionsContainer = document.getElementById('suggestions');
  loadingIndicator = document.getElementById('loading-indicator');
  refreshButton = document.getElementById('refresh-button');

  if (!chatInput || !sendButton || !chatBox || !suggestionsContainer || !loadingIndicator || !refreshButton) {
    console.error('Ein oder mehrere notwendige Elemente fehlen im DOM.');
    return;
  }

  // Eventlistener
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

// Wenn das DOM geladen ist, Chat starten
document.addEventListener('DOMContentLoaded', () => {
  initChat();
});
    