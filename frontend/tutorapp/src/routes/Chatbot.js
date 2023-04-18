import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import axios from 'axios';
import AudioRecorder from './audioRecord.js';

function Chatbot() {
  let [userMessage, setUserMessage] = useState([]);
  let [tutorMessage, setTutorMessage] = useState([]);
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
      setUserMessage([...userMessage, userInput]);
      setCheckUpdate(true);
      setUserInput('');
    }
  }
  //버튼 클릭시 사용
  function handleSendButton() {
    setUserMessage([...userMessage, userInput]);
    setCheckUpdate(true);
    setUserInput('');
  }

  const sendMessage = async () => {
    console.log(userMessage);
    console.log(userInput);

    try {
      // const response = await axios.post('https://329i02an76.execute-api.ap-northeast-2.amazonaws.com/prod/tutoringSpeak', {
        const response = await axios.post('https://a2e9fmj8s7.execute-api.ap-northeast-2.amazonaws.com/prod/tutoringSpeak', {
        userMessage: userMessage,
        tutorMessage: tutorMessage,
      }, {
        headers: {
          //'Access-Control-Allow-Origin': "https://tutoreal.pages.dev/",
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      console.log(data);
      setTutorMessage([...tutorMessage, data.assistant]);
    } catch (error) {
      console.error(error);
    }
  }

  //useEffect 이용해서 userMessage 업데이트 되고 checkUpdate true로 바뀌면 sendMessage 실행되도록 함
  useEffect(() => {
    if (checkUpdate) {
      sendMessage().then(() => {
        setCheckUpdate(false);
      });
    }
  }, [checkUpdate]);

  //채팅 ui에 tutor랑 user 메세지 순서대로 불러올 수 있도록 message로 integrate하는 부분
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
        <div className="chat-message tutor">
          <p>Let's start conversation!</p>
        </div>
        {messages.map((message, index) => (
          <div className={`chat-message ${index % 2 === 0 ? 'user' : 'tutor'}`} key={index}>
            <p>{message}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Type your message here..." value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyPress={handleKeyPress} />
        <button onClick={handleSendButton}>Send</button>
      </div>
      <div className='user-record'>
        <AudioRecorder/>
      </div>
    </div>
  );
}

export default Chatbot;