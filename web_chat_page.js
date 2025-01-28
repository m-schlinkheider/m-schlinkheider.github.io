// MarcelGPT Chat Implementation for Web
const suggestions = [
  'Erzählen Sie mir etwas über sich.',
  'Was sind Ihre Stärken?',
  'Wie gehen Sie mit Stress um?',
];

let messages = []; // Stores messages as {role: 'user' or 'assistant', content: '...'}
let isLoading = false;
let showSuggestions = true;

// Global DOM Elements
let chatInput, sendButton, chatBox, suggestionsContainer, loadingIndicator, refreshButton;

// Funktion zum Senden von Nachrichten an OpenAI
async function sendOpenAIRequest(message) {
  try {
    const response = await sendMessage(message); // Aufruf der Funktion aus openai_service_web.js
    return response;
  } catch (error) {
    console.error('Fehler bei der OpenAI API Anfrage:', error);
    throw new Error('Fehler beim Abrufen der Antwort von OpenAI.');
  }
}

// Render messages dynamically
function renderMessages() {
  if (!chatBox) {
    console.error('Element mit der ID "chat-box" wurde nicht gefunden.');
    return;
  }
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
  if (!suggestionsContainer) {
    console.error('Element mit der ID "suggestions" wurde nicht gefunden.');
    return;
  }
  suggestionsContainer.innerHTML = ''; // Clear existing suggestions
  if (showSuggestions) {
    suggestions.forEach((suggestion) => {
      const suggestionButton = document.createElement('button');
      suggestionButton.textContent = suggestion;
      suggestionButton.className = 'suggestion';
      suggestionButton.addEventListener('click', () => {
        if (!chatInput) {
          console.error('Element mit der ID "chat-input" wurde nicht gefunden.');
          return;
        }
        chatInput.value = suggestion;
        sendMessage();
      });
      suggestionsContainer.appendChild(suggestionButton);
    });
  }
}

// Send message to OpenAI
async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || isLoading) return;

  messages.push({ role: 'user', content: text });
  chatInput.value = '';
  isLoading = true;
  renderMessages();
  renderSuggestions();
  loadingIndicator.style.display = 'block';

  try {
    const response = await sendOpenAIRequest(text);
    messages.push({ role: 'assistant', content: response });
  } catch (error) {
    messages.push({ role: 'assistant', content: 'Es ist ein Fehler aufgetreten.' });
  } finally {
    isLoading = false;
    renderMessages();
    renderSuggestions();
    loadingIndicator.style.display = 'none';
  }
}

// Simulate OpenAI API request
// async function sendOpenAIRequest(message) {
//  return new Promise((resolve) => {
//    setTimeout(() => {
//      resolve('Dies ist eine Beispielantwort des Chatbots.');
//    }, 1000);
//  });
// }

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
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
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