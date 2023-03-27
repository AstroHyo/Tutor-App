import { useState } from 'react';
import { Stack, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Test() {
  async function getTutoring() {
    try {
        const response = await fetch('https://3000-astrohyo-tutorapp-uife88f4ccs.ws-us92.gitpod.io/tutoringSpeak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user : 'John' }) // replace with your desired data
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("somethingwrongbabe"+error);
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