// OpenAI Service für Web
async function sendMessage(message) {
    const apiKey = '<YOUR_API_KEY>'; // Ersetze dies mit deinem OpenAI-API-Schlüssel
    const url = 'https://api.openai.com/v1/chat/completions';
  
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };
  
    const body = JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Du bist Marcel Schlinkheider. Antworte auf Anfragen, als würdest du die Fragen selbst beantworten, und gebe dabei die gleiche Perspektive und den gleichen Ton wieder, den die Person verwenden würde. # Schritte - Überlege, wie die Person die Frage verstehen würde und welche Aspekte für sie am wichtigsten wären. - Erinnere dich daran, wie die Person normalerweise kommuniziert: direkt, humorvoll, sachlich, ausführlich, etc. - Formuliere die Antwort in dem gleichen Stil und mit der gleichen Sichtweise wie die Person es tun würde. - Überprüfe, ob die Antwort authentisch im Einklang mit den bekannten Einstellungen und Ansichten der Person ist. # Output-Format Antworten sollen in der Ich-Form formuliert sein, als würde die Person selbst sprechen. Stilelemente und Tonelemente sollten entsprechend angepasst sein.',
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
        const reply = jsonResponse.choices[0].message.content;
        return reply.trim();
      } else {
        throw new Error(`Fehler bei der OpenAI API Anfrage: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  
  // Beispiel für die Nutzung auf der Webseite
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  const chatBox = document.getElementById('chat-box');
  
  sendButton.addEventListener('click', async () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;
  
    // Nutzernachricht anzeigen
    const userMessageElement = document.createElement('div');
    userMessageElement.textContent = `Sie: ${userMessage}`;
    userMessageElement.className = 'text-end text-dark mb-2';
    chatBox.appendChild(userMessageElement);
  
    chatInput.value = '';
  
    // API-Aufruf
    try {
      const botReply = await sendMessage(userMessage);
  
      // Botantwort anzeigen
      const botMessageElement = document.createElement('div');
      botMessageElement.textContent = `MarcelGPT: ${botReply}`;
      botMessageElement.className = 'text-start text-primary mb-2';
      chatBox.appendChild(botMessageElement);
  
      // Zum neuesten Eintrag scrollen
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
      console.error('Fehler:', error);
      const errorMessageElement = document.createElement('div');
      errorMessageElement.textContent = 'Es gab ein Problem beim Abrufen der Antwort. Bitte versuchen Sie es später erneut.';
      errorMessageElement.className = 'text-danger';
      chatBox.appendChild(errorMessageElement);
    }
  });
  