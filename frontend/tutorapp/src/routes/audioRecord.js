import React, { useState, useCallback } from "react";

const AudioRecord = () => {
  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState();
  const [analyser, setAnalyser] = useState();
  const [audioUrl, setAudioUrl] = useState();
  const [disabled, setDisabled] = useState(true);

  const onRecAudio = async () => {
    setDisabled(true);

    // create an audio context and an audio worklet
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.audioWorklet.addModule('audio-worklet-processor.js');
    const audioWorkletNode = new AudioWorkletNode(audioContext, 'recorder');
    audioContext.resume();

    function makeSound(stream) {
      // create a media stream source from the stream
      const source = audioContext.createMediaStreamSource(stream);
      setSource(source);
      // connect the source to the worklet node
      source.connect(audioWorkletNode);
      audioWorkletNode.connect(audioContext.destination);
    }

    // request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    setStream(stream);
    setMedia(mediaRecorder);
    makeSound(stream);

    const chunks = [];
    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
      if (mediaRecorder.state === "inactive") {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        setAudioUrl(blob);
        setOnRec(true);
      }
    };

    mediaRecorder.onstop = function () {
      // disconnect the nodes when recording stops
      audioWorkletNode.disconnect();
      source.disconnect();
    };
  };

  // when the user stops the recording
  const offRecAudio = () => {
    media.stop();

    // stop all audio tracks in the stream
    stream.getAudioTracks().forEach(function (track) {
      track.stop();
    });

    if (audioUrl) {
      URL.createObjectURL(audioUrl); // this link can be used to download the recorded audio
    }

    setDisabled(false);
  };

  const play = () => { 
    const audio = new Audio(URL.createObjectURL(audioUrl)); 
    audio.loop = false;
    audio.volume = 1;
    audio.play();
  };

  return (
    <>
      <button onClick={onRecAudio}>녹음 시작</button>
      <button onClick={offRecAudio}>녹음 종료</button>
      <button onClick={play} disabled={disabled}>재생</button>
    </>
  );
};

export default AudioRecord;