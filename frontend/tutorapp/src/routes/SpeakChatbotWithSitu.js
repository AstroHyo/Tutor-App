import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom';
import { useWhisper } from '@chengsokdara/use-whisper'
import DetectOS from './detectOS.js'
import EasySpeech from 'easy-speech'
import './Chatbot.css';
import './audioRecord.css'
import axios from 'axios';
import logo from './../img/logo.png';
import PreRequest from './ShowPrerequest.js';

function SpeakChatbot() {
  let userSituation = useSelector((state) => state.userSituation ) //채팅 상황 설정

  const navigate = useNavigate();
  let [userMessage, setUserMessage] = useState([]);
  let [tutorMessage, setTutorMessage] = useState([]);
  let [userInput, setUserInput] = useState("");
  let [conversation, setConversation] = useState(null); //전체대화 set
  let [TTSVoice, setTTSVoice] = useState(null); //TTS voice 설정
  let [feedback, setFeedback] = useState(null); //피드백 set
  //만약 userMessage 값이 업데이트되면 true
  let [checkUpdate, setCheckUpdate] = useState(false);
  //record중인지 check
  let [checkRecording, setCheckRecording] = useState(false);
  //mic 연결 check
  const [isMicrophoneConnected, setIsMicrophoneConnected] = useState(false);
  const chatBoxRef = useRef(null);
  const feedbackBtn = "대화 종료하고\n피드백 받기!";

  //MIC 설정
  useEffect(() => {
    async function checkMicrophoneConnection() {
      //mic 연결 가능 check
      const isWebRTCSupported = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
      if (!isWebRTCSupported) {
        return;
      }
      //mic 허용 했는지 check
      const isMicrophoneConnected = await navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          stream.getTracks().forEach(track => track.stop());
          return true;
        })
        .catch(() => {
          return false;
        });
      setIsMicrophoneConnected(isMicrophoneConnected);
    }
    checkMicrophoneConnection();
  }, []);

  //OS 확인
  useEffect(() => {
    async function EasySpeechInit() {
      await EasySpeech.init()
      console.log(userSituation);
      setTTSVoice(EasySpeech.voices()[2]); //크롬에 맞게 먼저 set
      let OS = DetectOS();
      console.log(OS);
      //만약 IOS면 보이스를 moira로 설정
      if(OS === "iOS") {
        setTTSVoice(EasySpeech.voices()[35]); //여: 35 36 27 남: 30
        console.log(TTSVoice.name);
      }
    }
    EasySpeechInit(); 
  }, [])

  //STT
  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    // autoStart: true,
    // nonStop: true,
    // stopTimeout: 3000,
  })

  //TTS
  const TTS = async (tutorSpeak) => {
    try{
      await EasySpeech.init()
      console.log(TTSVoice.name)
      const s = EasySpeech.voices();
      for(var i=0; i<s.length; i++) {
        console.log(i + s[i].name + s[i].lang);
      }
      // console.log(EasySpeech.voices())
      // console.log(k)
      // console.log(EasySpeech.voices()[k])
      await EasySpeech.speak({ 
        text: tutorSpeak,
        //voice: TTSVoice,
        //pitch: 1.2,  // a little bit higher
        //rate: 1.7, // a little bit faster
        boundary: event => console.debug('word boundary reached', event.charIndex),
      })  
    } catch(e) {
      console.log(e)
    }
  }

  //scroll을 아래로 내려주기 위한 코드
  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [tutorMessage, userMessage]);

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

  //transcrip.text가 존재하면(즉, 녹음 완료하면) UserMessage 업데이트하고 CheckUpdate(true)로 만들어주는 useEffect
  useEffect(() => {
    if (transcript.text) {
      setUserMessage([...userMessage, transcript.text]);
      setCheckUpdate(true);
    }
  }, [transcript.text]);

///////////////////////////////////////////////////////////////////////////////////
  const sendMessage = async () => {
    try {
      const response = await axios.post('https://329i02an76.execute-api.ap-northeast-2.amazonaws.com/prod/tutoringSpeakWithSitu', {
        situation: userSituation,
        userMessage: userMessage,
        tutorMessage: tutorMessage,
      }, {
        headers: {
          //'Access-Control-Allow-Origin': "https://tutoreal.pages.dev/",
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      setTutorMessage([...tutorMessage, data.assistant]);
      await TTS(data.assistant);
      setConversation(data.conversation); //전체 대화 내용을 update
    } catch (error) {
      console.error(error);
    }
  }

  //useEffect 이용해서 userMessage 업데이트 되고 checkUpdate true로 바뀌면 sendMessage 실행되도록 함
  useEffect(() => {
    if (checkUpdate) {
      sendMessage().then(() => {
        setCheckUpdate(false);
        transcript.text = null;
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

  const getFeedback = async () => {
    try {
      const response = await axios.post('https://329i02an76.execute-api.ap-northeast-2.amazonaws.com/prod/getFeedback', {
        conversation: conversation,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      setFeedback(data.feedback); //받아온 피드백 set
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="chat-container">
      <h1 className="chat-title">진짜 같은 인공지능 영어 튜터</h1>
      <img className="chat-logo" onClick={() => { navigate('/'); }} src={logo} alt="logoImg"/>

      <div className="userSituBox">
        <p>🔥 대화 상황: {userSituation} 🔥</p>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        <div className="chat-message tutor">
          <p>Please start the conversation first about what you would like to discuss!</p>
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

      <div>
        {isMicrophoneConnected ? (
          <div>
            { checkRecording? (
              <button className="recordStopBtn" onClick={() => { stopRecording(); setCheckRecording(false); }}>Stop</button>
            ) : (
              <button className="recordStartBtn" onClick={() => { setCheckRecording(true); startRecording();  }}>Speak!</button>
            )}
          </div>
        ) : (
          <div>
            <br/>
            <h6 style={{color: 'white', fontWeight: 'bold'}}>마이크 연결을 확인해주세요</h6>
          </div>
        )}
      </div>

      <div>
        <button className="convFinishBtn" onClick={getFeedback}>{feedbackBtn}</button>
      </div>
      <div>
        {feedback && <div className='Feedback' dangerouslySetInnerHTML={{ __html: feedback.replace(/<h3/g, '<h4 class="feedback-h4"').replace(/<h4/g, '<h4 class="feedback-h4"').replace(/<ul/g, '<ul class="feedback-ul"').replace(/<li/g, '<li class="feedback-li"') }} />}
      </div>
      <PreRequest/>
    </div>
  );
}

export default SpeakChatbot;