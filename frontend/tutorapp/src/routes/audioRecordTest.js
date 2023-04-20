import React, { useState } from 'react';

function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);

  let media = [];
  let mediaRecorder;
  const constraints = { audio: true };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size) {
          media.push(e.data);
        }
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setRecording(false);
      setUploading(true);
      console.log(media);
    }    
  };

  const upload = async () => {
    const formData = new FormData();
    formData.append('audio', new Blob(media, { type: 'audio/webm;codecs=opus' }), 'audio.webm');
    console.log(formData);
    await fetch('https://jqait94u49.execute-api.ap-northeast-2.amazonaws.com/prod/recordToText', { method: 'POST', body: formData });
    setUploading(false);
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording || uploading}>
        {recording ? 'Recording...' : 'Record'}
      </button>
      <button onClick={stopRecording} disabled={!recording || uploading}>
        {uploading ? 'Uploading...' : 'Stop Recording'}
      </button>
      <button onClick={upload}>
        upload
      </button>
    </div>
  );
}

export default AudioRecorder;