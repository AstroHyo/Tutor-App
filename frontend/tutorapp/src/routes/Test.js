import { useState } from 'react';
import { Stack, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Test() {
  async function getTutoring() {
    try {
        const response = await fetch('http://localhost:3000/tutoringSpeak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'John' }) // replace with your desired data
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

  return (
    <div className="Test">
        <h1>테스트</h1>
        <button onClick={()=>{getTutoring()}}> 요청하기 </button>
    </div>
  );
}

export default Test;