import React, { useState, useEffect } from 'react';
import Loading from './Loading.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatStart from './routes/ChatStart'
import ChatSituation from './routes/ChatSituation';
import Chatbot from './routes/Chatbot';
import ChatbotWithSitu from './routes/ChatbotWithSitu';
import PreRequest from './routes/PreRequest';
import { Routes, Route, useNavigate } from 'react-router-dom';
import logo from './img/logo.png';

function App() {
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  let text = "틀에서 벗어난 개인화된 \n 회화 튜터링을 제공합니다.";

  useEffect(() => { 
    setLoading(false); 
  }, []);

  return (
    <div className="App" style={{  }}>
      { loading && <Loading /> }
      <Routes>
        <Route path="/" element={
          <div className="container">
            <h1 className="title">진짜 같은 인공지능 영어 튜터</h1>
            <img className="logo" src={logo} alt="logoImg"/>
            <p className="content"> {text} </p>
            <div>
              <button className="mainBtn" onClick={() =>{ navigate('/chatStart') }}>
                대화 시작하기!
              </button>
            </div>
            <div>
              <button className="subBtn" style={{marginRight: '30px'}} onClick={() =>{ navigate('/PreRequest')}}>
                정식 서비스 사전 신청하기✅
              </button>
              <button className="subBtn" onClick={() => window.open(`https://tally.so/r/mYPEeN`, "_blank")}>
                피드백 해주세요🙇🏻‍♂️
              </button>
            </div>
            <div className="engage-hub-form-embed" id="eh_form_6430245462212608" data-id="6430245462212608"></div>
          </div>
        }/>

        <Route path="/chatStart" element={<ChatStart/>}/>

        <Route path="/chatSituation" element={<ChatSituation/>}/>

        <Route path="/chatWithTutor" element={<Chatbot/>}/>

        <Route path="/chatWithTutorSitu" element={<ChatbotWithSitu/>}/>

        <Route path="/PreRequest" element={<PreRequest/>}/>

      </Routes>
    </div>
  );
}

export default App;