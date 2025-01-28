// MarcelGPT Chat Implementation for Web
const suggestions = [
    'Erzählen Sie mir etwas über sich.',
    'Was sind Ihre Stärken?',
    'Wie gehen Sie mit Stress um?',
  ];
  
  let messages = []; // Stores messages as {role: 'user' or 'assistant', content: '...'}
  let isLoading = false;
  let showSuggestions = true;
  
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  const chatBox = document.getElementById('chat-box');
  const suggestionsContainer = document.getElementById('suggestions');
  const loadingIndicator = document.getElementById('loading-indicator');
  
  // Render messages dynamically
  function renderMessages() {
    chatBox.innerHTML = '';
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
    if (showSuggestions) {
      suggestionsContainer.innerHTML = '';
      suggestions.forEach((suggestion) => {
        const suggestionButton = document.createElement('button');
        suggestionButton.textContent = suggestion;
        suggestionButton.className = 'suggestion';
        suggestionButton.onclick = () => {
          chatInput.value = suggestion;
          sendMessage();
        };
        suggestionsContainer.appendChild(suggestionButton);
      });
    } else {
      suggestionsContainer.innerHTML = '';
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
  async function sendOpenAIRequest(message) {
    // Replace with actual API logic
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Dies ist eine Beispielantwort des Chatbots.');
      }, 1000);
    });
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
    renderMessages();
    renderSuggestions();
  
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  
    document.getElementById('refresh-button').addEventListener('click', refreshChat);
  }
  
  // Run the chat initialization
  initChat();
  