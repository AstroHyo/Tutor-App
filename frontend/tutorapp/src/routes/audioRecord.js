import React, { useState, useRef } from "react";
import './audioRecord.css';

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioRef = useRef(null);

  const handleStartRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      setRecording(true);
      setMediaRecorder(mediaRecorder);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          setAudioBlob(event.data);
        }
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
      </div>
      <audio controls ref={audioRef}></audio>
    </div>
  );
};

export default VoiceRecorder;