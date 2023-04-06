import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Let's start conversation!", sender: "assistant" }
  ]);
  let [userMessage, setUserMessage] = useState([]);
  let [tutorMessage, setTutorMessage] = useState([
    { text: "Let's start conversation!", sender: "assistant" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatBoxRef = useRef(null);

  //scroll을 아래로 내려주기 위한 코드
  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [tutorMessage]);

  //엔터 
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      console.log(userMessage);
      console.log(inputValue);
      sendMessage();
    }
  }

  const sendMessage = async () => {
    setUserMessage([...userMessage, { text: inputValue, sender: "user" }]);
    console.log(userMessage);
    console.log(inputValue);

    const response = await fetch('https://t24pvn1ghl.execute-api.ap-northeast-2.amazonaws.com/prod/tutoringSpeak', {
      method: 'POST',
      headers: {
        //'Access-Control-Allow-Origin': "https://tutor-app.pages.dev",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userMessage: userMessage,
        tutorMessage: tutorMessage,
      })
    });
    console.log(userMessage);
    console.log(userMessage[0]);
    const data = await response.json();
    setTutorMessage([...tutorMessage, { text: data.assistant, sender: "assistant" }]);
    setInputValue('');
  }
  //345
  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}>
        {tutorMessage.map((message, index) => (
          <div className="chat-message assistant" key={index}>
            <p>{message.text}</p>
          </div>
        ))}
        {userMessage.map((message, index) => (
          <div className="chat-message user" key={index}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Type your message here..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;