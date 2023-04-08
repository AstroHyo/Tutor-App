import React, { useState, useCallback } from "react";

const AudioRecord = () => {
  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState();
  const [audioUrl, setAudioUrl] = useState();
  const [disabled, setDisabled] = useState(true);

  const onRecAudio = async () => {
    setDisabled(true);

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const workletNode = new AudioWorkletNode(audioCtx, "recorder-worklet-processor");
    await audioCtx.audioWorklet.addModule("/audio-worklet.js");

    function makeSound(stream) {
      const source = audioCtx.createMediaStreamSource(stream);
      setSource(source);
      source.connect(workletNode);
      workletNode.connect(audioCtx.destination);
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      setStream(stream);
      setMedia(mediaRecorder);
      makeSound(stream);

      workletNode.port.onmessage = (event) => {
        setAudioUrl(event.data);
        setOnRec(true);
      };

      setOnRec(false);
    });
  };

  const offRecAudio = async () => {
    media.stop();
    stream.getTracks().forEach((track) => track.stop());
    source.disconnect();

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const workletNode = new AudioWorkletNode(audioCtx, "recorder-worklet-processor");
    await audioCtx.audioWorklet.addModule("/audio-worklet.js");

    workletNode.port.postMessage("stop");
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
      <button onClick={play} disabled={disabled}>
        재생
      </button>
    </>
  );
};

export default AudioRecord;