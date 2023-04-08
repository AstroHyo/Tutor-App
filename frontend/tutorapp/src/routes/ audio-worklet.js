// audio-worklet.js

class RecorderWorkletProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
  
      this.audioChunks = [];
  
      this.port.onmessage = (event) => {
        if (event.data === "start") {
          this.start();
        } else if (event.data === "stop") {
          this.stop();
        }
      };
    }
  
    process(inputs, outputs, parameters) {
      if (inputs[0]) {
        const input = inputs[0][0];
        this.audioChunks.push(input);
      }
  
      return true;
    }
  
    start() {
      this.audioChunks = [];
    }
  
    stop() {
      const blob = new Blob(this.audioChunks, { type: "audio/webm;codecs=opus" });
      this.port.postMessage(blob);
    }
  }
  
  registerProcessor("recorder-worklet-processor", RecorderWorkletProcessor);