import React, { useState } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Let's start conversation!", sender: "assistant" }
  ]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = async () => {
    const response = await fetch('https://b3uiuqz870.execute-api.ap-northeast-2.amazonaws.com/prod/tutoringSpeak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: inputValue
      })
    });
    const data = await response.json();
    const astrologerMessage = { text: data.assistant, sender: "assistant" };
    setMessages([...messages, { text: inputValue, sender: "user" }, astrologerMessage]);
    setInputValue('');
  }

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((message, index) => (
          <div className={`chat-message ${message.sender}`} key={index}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Type your message here..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;