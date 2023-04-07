import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

function Chatbot() {
  let [userMessage, setUserMessage] = useState([]);
  let [tutorMessage, setTutorMessage] = useState([
    { text: "Let's start conversation!", sender: "assistant" }
  ]);
  //만약 userMessage 값이 업데이트되면 true
  let [checkUpdate, setCheckUpdate] = useState(false);
  let [userInput, setUserInput] = useState("");
  const chatBoxRef = useRef(null);
  
  //scroll을 아래로 내려주기 위한 코드
  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [tutorMessage]);

  //엔터 입력 시 userMessage 업데이트하고 chechupdate true
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setUserMessage([...userMessage, { text: userInput, sender: "user" }]);
      setCheckUpdate(true);
    }
    // if (event.key === 'Enter') {
    //   console.log(userMessage);
    //   console.log(userInput);
    //   sendMessage();
    // }
  }

  const sendMessage = async () => {
    console.log(userMessage);
    console.log(userInput);

    const response = await fetch('https://t24pvn1ghl.execute-api.ap-northeast-2.amazonaws.com/prod/tutoringSpeak', {
      method: 'POST',
      headers: {
        //'Access-Control-Allow-Origin': "https://tutor-app.pages.dev",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        //userMessage: "I want lunch.",
        //tutorMessage: "hello ",
      })
    });
    console.log(userMessage);
    console.log(userMessage[0]);
    const data = await response.json();
    setTutorMessage([...tutorMessage, { text: data.assistant, sender: "assistant" }]);
    setUserInput('');
  }

  useEffect(() => {
    if (checkUpdate) {
      sendMessage().then(() => {
        setCheckUpdate(false);
      });
    }
  }, [checkUpdate]);

  let messages = [];
  let userIndex = 0;
  let tutorIndex = 0;
  while (userIndex < userMessage.length && tutorIndex < tutorMessage.length) {
    if (userIndex <= tutorIndex) {
      messages.push(userMessage[userIndex]);
      userIndex++;
    } else {
      messages.push(tutorMessage[tutorIndex]);
      tutorIndex++;
    }
  }
  messages = messages.concat(userMessage.slice(userIndex)).concat(tutorMessage.slice(tutorIndex));

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((message, index) => (
          <div className={'chat-message ${message.sender}'} key={index}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Type your message here..." onChange={(e) => setUserInput(e.target.value)} onKeyPress={handleKeyPress} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;