const GoogleTTS = async (text) => {
    
    const response = await axios.get('https://voyqgstdt77eaffsw44sc6t4qm0orxum.lambda-url.ap-northeast-2.on.aws/prod/TTS',{
        responseType : 'arraybuffer'
    })

    console.log("response : ",response);

    // let arr = toArrayBuffer(response.data);
    // makeAudio(arr);

    const audioContext = getAudioContext();

    // makeAudio(response)
    const audioBuffer = await audioContext.decodeAudioData(response.data);

    //create audio source
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
    console.log("source : ", source);
    
    return source;
};

const getAudioContext = () => {
    AudioContext = window.AudioContext; /* || window.webkitAudioContext */
    const audioContent = new AudioContext();
    return audioContent;
};

export {GoogleTTS}