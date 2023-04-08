import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chatbot from './routes/Chatbot';
import ChatStart from './routes/ChatStart'
import ChatSituation from './routes/ChatSituation';
import Test from './routes/Test';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Stack } from 'react-bootstrap';

function App() {

  let navigate = useNavigate();
  let [situation, setSituation] = useState('preparing for OPIC')
  let text = "틀에서 벗어난 개인화된 \n 회화 튜터링을 제공합니다.";

  return (
    <div className="App" style={{  }}>
      <Routes>

        <Route path="/" element={
          <div className="container">
            <h1 className="title">진짜 같은 인공지능 영어 튜터</h1>
            <p className="brand">TutoReal</p>
            <p className="content">  {text} </p>

            {/* <Stack gap={2} className="example">
              <Stack direction="horizontal" gap={3}>
                <div className="exampleBox"></div>
                <div className="exampleBox"></div>
                <div className="exampleBox"></div>
              </Stack>
              <Stack direction="horizontal" gap={3} className="exampleContainer">
                <div className="exampleBox"></div>
                <div className="exampleBox"></div>
                <div className="exampleBox"></div>
              </Stack>
            </Stack> */}
            
            <button className="click" onClick={() =>{ navigate('/chatStart') }}>
              대화 시작하기!
            </button>

            <button className="click" onClick={() =>{ navigate('/chatStart') }}>
              영어 작문 첨삭 받아볼래? (무료임)
            </button>
          </div>
        }/>

        <Route path="/chatStart" element={<ChatStart/>}/>

        <Route path="/chatWithTutor" element={<Chatbot/>}/>

        <Route path="/chatSituation" element={<ChatSituation/>}/>

        <Route path="/test" element={<Test/>}/>

      </Routes>
    </div>
  );
}

export default App;