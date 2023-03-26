import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';

function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatbotAPIEndpoint = 'https://api.openai.com/v1/engine/gpt-3.5/completions';

  // Set focus on input field on initial load
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Send message to the chatbot and get response
  const sendMessage = async (text) => {
    setMessages([...messages, { text, sender: 'user' }]);
    setInputValue('');
    try {
      const response = await fetch(chatbotAPIEndpoint, {
        method: 'POST',
        headers: {
           Accept: "application / json",
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`
        },
        body: JSON.stringify({
          prompt: `Conversation with chatbot:\n\nUser: ${text}\nChatbot:`,
          max_tokens: 50,
          temperature: 0.5,
          n: 1,
          stop: '\n'
        })
      });
      const data = await response.json();
      const chatbotMessage = data.choices[0].text.trim();
      setMessages([...messages, { text: chatbotMessage, sender: 'chatbot' }]);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle user input submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      sendMessage(inputValue);
    }
  };

  return (
    <div className="Chatbot">
      <header>
        <button className="back-button" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h1>Tutory</h1>
      </header>
      <main>
        <ul className="message-list">
          {messages.map((message, index) => (
            <li key={index} className={message.sender}>
              <div className="message-bubble">{message.text}</div>
            </li>
          ))}
        </ul>
      </main>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} ref={inputRef} />
        <button type="submit"><i className="bi bi-arrow-right"></i></button>
      </form>
    </div>
  );
}

export default Chatbot;