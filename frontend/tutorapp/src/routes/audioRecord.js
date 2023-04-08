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

    try {
      const audioCtx = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      const source = audioCtx.createMediaStreamSource(stream);
      const audioWorkletUrl = "audioWorklet.js";
      await audioCtx.audioWorklet.addModule(audioWorkletUrl);
      const analyser = new AudioWorkletNode(audioCtx, "analyser-processor");
      setAnalyser(analyser);

      source.connect(analyser).connect(audioCtx.destination);

      analyser.port.onmessage = (event) => {
        if (event.data.playbackTime > 180) {
          stream.getTracks().forEach((track) => track.stop());

          mediaRecorder.stop();
          mediaRecorder.ondataavailable = (e) => {
            setAudioUrl(e.data);
            setOnRec(true);
          };

          analyser.disconnect();
          source.disconnect();
        } else {
          setOnRec(false);
        }
      };

      setStream(stream);
      setMedia(mediaRecorder);
      setSource(source);
    } catch (err) {
      console.error(err);
    }
  };

  const offRecAudio = () => {
    media.ondataavailable = (e) => {
      setAudioUrl(e.data);
      setOnRec(true);
    };

    stream.getTracks().forEach((track) => track.stop());
    media.stop();

    analyser.disconnect();
    source.disconnect();

    if (audioUrl) {
      URL.createObjectURL(audioUrl); // 출력된 링크에서 녹음된 오디오 확인 가능
    }

    const sound = new File([audioUrl], "soundBlob", {
      lastModified: new Date().getTime(),
      type: "audio",
    });

    setDisabled(false);
    console.log(sound); // File 정보 출력
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