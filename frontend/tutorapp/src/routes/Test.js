import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Test.css';

function Test() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const chatBoxRef = useRef(null);

  //scroll을 아래로 내려주기 위한 코드
  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

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
      const response = await axios.post('https://b3uiuqz870.execute-api.ap-northeast-2.amazonaws.com/prod/tutoringSpeak',
        { message: messageInput },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        });

      const tutorMessage = { type: 'assistant', text: "Tutor: " + response.data.assistant };
      setMessages([...messages, tutorMessage]);
    } catch (error) {
      console.error(error);
      alert('Failed to send message. Please try again later.');
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}>
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
