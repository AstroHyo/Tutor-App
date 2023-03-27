import { useState } from 'react';
//import { Stack, Form, Row, Col } from 'react-bootstrap';
//import { useNavigate } from 'react-router-dom';
import './Test.css';
//https://3000-astrohyo-tutorapp-uife88f4ccs.ws-us92.gitpod.io/tutoringSpeak

function Test() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  //유저가 채팅 입력 시 setMessageInput
  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  }

  //Send 버튼 클릭 시, newMessage를 messages 배열에 update
  const handleSend = async () => {
    const newMessage = { type: 'user', text: "user: " + messageInput };
    setMessages([...messages, newMessage]);
    setMessageInput('');

    try {
      const response = await fetch('https://3000-astrohyo-tutorapp-uife88f4ccs.ws-us92.gitpod.io/tutoringSpeak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageInput
        })
      });

      const data = await response.json();

      const tutorMessage = { type: 'assistant', text: "Tutor: " + data.assistant };
      setMessages([...messages, tutorMessage]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.type}`}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Type your message here..." value={messageInput} onChange={handleInputChange} />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Test;