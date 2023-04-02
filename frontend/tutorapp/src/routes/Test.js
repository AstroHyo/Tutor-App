import { useState } from 'react';
import './Test.css';
//import { Stack, Form, Row, Col } from 'react-bootstrap';
//import { useNavigate } from 'react-router-dom';

function Test() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  //유저가 채팅 입력 시 setMessageInput
  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  }

  //Send 버튼 클릭 시, newMessage를 messages 배열에 update
  const handleSend = async () => {
    const newMessage = { type: 'user', text: "user: " + messageInput };
    setMessages([...messages, newMessage]);
    setMessageInput('');

    try {
      const response = await fetch('https://nozo3khnyafreomenebxkfdbzi0tpqpk.lambda-url.ap-northeast-2.on.aws/tutoringSpeak', {
        method: 'POST',
        header: {
          'Access-Control-Allow-Origin': 'https://nozo3khnyafreomenebxkfdbzi0tpqpk.lambda-url.ap-northeast-2.on.aws',
          'Content-Type': 'application/json',
          credentials: "include",
        },
        body: JSON.stringify({ message: messageInput })
      });

      const data = await response.json();

      const tutorMessage = { type: 'assistant', text: "Tutor: " + data.assistant };
      setMessages([...messages, tutorMessage]);
    } catch (error) {
      console.error(error);
    }
  }
//332 555
  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.type}`}>
            <p className="assistant">{message.text}</p>
          </div>
        ))}
      </div>
        <div className="chat-input">
          <input type="text" placeholder="Type your message here..." value={messageInput} onChange={handleInputChange} onKeyPress={handleKeyPress} />
          <button onClick={handleSend}>Send</button>
        </div>
    </div>
  );
}

export default Test;