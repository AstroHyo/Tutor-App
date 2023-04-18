import React, { useState, useRef } from "react";
import './audioRecord.css';
import axios from 'axios';

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const audioRef = useRef(null);
  const [recordText, setRecodeText] = useState('');

  const handleStartRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      setRecording(true);
      setMediaRecorder(mediaRecorder);
  
      const chunks = [];
      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      });
  
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
        setAudioBlob(audioBlob);
      });
    });
  };
  
  const handleStopRecording = () => {
    if (mediaRecorder !== null) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handlePlayRecording = () => {
    if (audioBlob !== null) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  const handleSendRecording = async () => {
    try {
      if (audioBlob !== null) {
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.mp3");
  
        const response = await axios.post(
          "https://jqait94u49.execute-api.ap-northeast-2.amazonaws.com/prod/recordToText",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const data = await response.data;
        setRecodeText(data.text);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
      <div>
        {recording ? (
          <button className="recordStopBtn" onClick={handleStopRecording} disabled={!recording}>■</button>
        ) : (
          <button className="recordStartBtn" onClick={handleStartRecording} disabled={recording}>▶</button>
        )}
        <button className="recordPlayBtn" onClick={handlePlayRecording} disabled={!audioBlob}>
          Play
        </button>
        <button className="recordSendBtn" onClick={handleSendRecording} disabled={!audioFile}>
          Send
        </button>
      </div>
      <audio controls ref={audioRef}></audio>
      <p>{recordText}</p>
    </div>
  );
};

export default VoiceRecorder;