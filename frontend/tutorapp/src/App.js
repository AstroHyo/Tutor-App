import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SpeakChatbot from './routes/SpeakChatbot';
import ChatStart from './routes/ChatStart'
import ChatSituation from './routes/ChatSituation';
import { Routes, Route, useNavigate } from 'react-router-dom';
import logo from './img/logo.png';

function App() {

  let navigate = useNavigate();
  let text = "틀에서 벗어난 개인화된 \n 회화 튜터링을 제공합니다.";

  return (
    <div className="App" style={{  }}>
      <Routes>

        <Route path="/" element={
          <div className="container">
            <h1 className="title">진짜 같은 인공지능 영어 튜터</h1>
            <img className="logo" src={logo} alt="logoImg"/>
            <p className="content"> {text} </p>
            <div>
              <button className="click" onClick={() =>{ navigate('/chatStart') }}>
                대화 시작하기!
              </button>
            </div>
            <div>
              <button className="click" onClick={() =>{ navigate('/chatStart') }}>
                영어 작문 첨삭 받아볼래? (무료임)
              </button>
            </div>
          </div>
        }/>

        <Route path="/chatStart" element={<ChatStart/>}/>

        <Route path="/chatWithTutor" element={<SpeakChatbot/>}/>

        <Route path="/chatSituation" element={<ChatSituation/>}/>

      </Routes>
    </div>
  );
}

export default App;