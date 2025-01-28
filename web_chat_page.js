// MarcelGPT Chat Implementation for Web
const suggestions = [
  'Erzählen Sie mir etwas über sich.',
  'Was sind Ihre Stärken?',
  'Wie gehen Sie mit Stress um?',
];

let messages = []; // Stores messages as {role: 'user' or 'assistant', content: '...'}
let isLoading = false;
let showSuggestions = true;

let chatInput, sendButton, chatBox, suggestionsContainer, loadingIndicator, refreshButton;

// Funktion zum Senden von Nachrichten an OpenAI
async function sendMessage(message) {
  const apiKey = personalData.OpenAIApiKey; // Ersetze dies mit deinem OpenAI-API-Schlüssel
  const url = 'https://api.openai.com/v1/chat/completions';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  const body = JSON.stringify({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'Du bist Marcel Schlinkheider. Antworte auf Anfragen, als würdest du die Fragen selbst beantworten, und gebe dabei die gleiche Perspektive und den gleichen Ton wieder, den die Person verwenden würde.',
      },
      { role: 'user', content: message },
    ],
    max_tokens: 150,
    n: 1,
    stop: null,
    temperature: 0.7,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse.choices[0].message.content.trim();
    } else {
      throw new Error(`Fehler bei der OpenAI API Anfrage: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Render messages dynamically
function renderMessages() {
  chatBox.innerHTML = ''; // Clear existing messages
  messages.forEach((message) => {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.role}`;
    messageElement.textContent = message.content;
    chatBox.appendChild(messageElement);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Render suggestions dynamically
function renderSuggestions() {
  suggestionsContainer.innerHTML = ''; // Clear existing suggestions
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

// Send user message and handle bot response
async function sendUserMessage() {
  const userMessage = chatInput.value.trim();
  if (!userMessage || isLoading) return;

  // Benutzer-Nachricht hinzufügen
  messages.push({ role: 'user', content: userMessage });
  chatInput.value = '';
  isLoading = true;
  renderMessages();
  renderSuggestions();
  loadingIndicator.style.display = 'block';

  try {
    // API-Aufruf
    const botReply = await sendMessage(userMessage);
    messages.push({ role: 'assistant', content: botReply });
  } catch (error) {
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

// Refresh the chat
function refreshChat() {
  messages = [];
  showSuggestions = true;
  renderMessages();
  renderSuggestions();
}

// Initialize the chat UI
function initChat() {
  // Assign global elements
  chatInput = document.getElementById('chat-input');
  sendButton = document.getElementById('send-button');
  chatBox = document.getElementById('chat-box');
  suggestionsContainer = document.getElementById('suggestions');
  loadingIndicator = document.getElementById('loading-indicator');
  refreshButton = document.getElementById('refresh-button');

  // Check if all elements are available
  if (!chatInput || !sendButton || !chatBox || !suggestionsContainer || !loadingIndicator || !refreshButton) {
    console.error('Ein oder mehrere notwendige Elemente fehlen im DOM.');
    return;
  }

  // Initialize event listeners
  sendButton.addEventListener('click', sendUserMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendUserMessage();
    }
  });
  refreshButton.addEventListener('click', refreshChat);

  // Initial render
  renderMessages();
  renderSuggestions();
}

// Run the chat initialization
document.addEventListener('DOMContentLoaded', () => {
  initChat();
});
