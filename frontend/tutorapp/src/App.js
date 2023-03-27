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

  return (
    <div className="App" style={{  }}>
      <Routes>

        <Route path="/" element={
          <div className="container">
            <h1 className="title">나만의 영어 튜터</h1>
            <p className="brand">Tutory</p>
            <p className="content">아래 제시된 상황 중 하나를 택하거나, 원하는 상황에서 영어로 대화할 수 있어요</p>

            <Stack gap={2} className="example">
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
            </Stack>
            
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


        <Route path="/*" element={<h1>404page, but you can enjoy</h1>}/>

      </Routes>
    </div>
  );
}

export default App;