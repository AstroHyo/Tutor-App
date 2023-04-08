import React, { useState, useCallback } from "react";

const AudioRecord = () => {
  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState();
  const [analyser, setAnalyser] = useState();
  const [audioUrl, setAudioUrl] = useState();
  const [disabled, setDisabled] = useState(true);

  const onRecAudio = () => {

    setDisabled(true)
    
    // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const workletProcessor = `class RecorderWorkletProcessor extends AudioWorkletProcessor {
      constructor() {
        super();
        this.port.onmessage = this.handleMessage_.bind(this);
        this.recordedData_ = [];
      }
      handleMessage_(event) {
        const data = event.data;
        if (data.type === "data") {
          this.recordedData_.push(data.buffer);
        } else if (data.type === "done") {
          const blob = new Blob(this.recordedData_, {type: "audio/wav"});
          this.port.postMessage(blob);
          this.recordedData_ = [];
        }
      }
      process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input.length > 0) {
          const buffer = input[0];
          this.port.postMessage({
            type: "buffer",
            buffer: buffer
          });
          this.recordedData_.push(buffer);
        }
        return true;
      }
    }
    registerProcessor("recorder-worklet-processor", RecorderWorkletProcessor);
    `;
    // register the worklet processor
    audioCtx.audioWorklet.addModule(
      URL.createObjectURL(new Blob([workletProcessor], { type: "application/javascript" }))
    ).then(() => {
      // create an AudioWorkletNode object
      const recorderNode = new AudioWorkletNode(audioCtx, "recorder-worklet-processor");
      setAnalyser(recorderNode);
      // getUserMedia() method to request access to a user's microphone
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        setStream(stream);
        setMedia(mediaRecorder);
        // create a MediaStreamAudioSourceNode object
        const source = audioCtx.createMediaStreamSource(stream);
        setSource(source);
        // connect the AudioWorkletNode and the MediaStreamAudioSourceNode
        source.connect(recorderNode);
        recorderNode.connect(audioCtx.destination);
        mediaRecorder.ondataavailable = function (e) {
          setAudioUrl(e.data);
          setOnRec(true);
        };
      });
    }).catch((err) => {
      console.log(err);
    });
  };

  // 사용자가 음성 녹음을 중지 했을 때
  const offRecAudio = () => {
    // dataavailable 이벤트로 Blob 데이터에 대한 응답을 받을 수 있음
    media.ondataavailable = function (e) {
      setAudioUrl(e.data);
      setOnRec(true);
    };

    // 모든 트랙에서 stop()을 호출해 오디오 스트림을 정지
    stream.getAudioTracks().forEach(function (track) {
      track.stop();
    });

    // 미디어 캡처 중지
    media.stop();

    // 메서드가 호출 된 노드 연결 해제
    analyser.disconnect();
    source.disconnect();
    
    if (audioUrl) {
      URL.createObjectURL(audioUrl); // 출력된 링크에서 녹음된 오디오 확인 가능
    }
    
    // File 생성자를 사용해 파일로 변환
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