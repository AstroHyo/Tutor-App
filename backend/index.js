const apiKey = "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";
const serverless = require('serverless-http');
const { Configuration, OpenAIApi } = require("openai");
//express를 불러와서 이걸 app으로 만든다.
const express = require('express')
var cors = require('cors')
const app = express()
const fs = require("fs")
const multer = require("multer");
//확장자 그대로 이름 저장
const storage = multer.diskStorage({
  destination: "/tmp",
  filename: function (req, file, cb) {
    cb(null, file.originalname); // keep the original filename
  },
});
const upload = multer({ storage: storage });
// const upload = multer({ dest: "/tmp" });
const { Readable } = require('stream');

const FormData = require('form-data');
const axios = require('axios');
const path = require('path');

const configuration = new Configuration({
    apiKey: apiKey,
  });
const openai = new OpenAIApi(configuration);

//CORS 이슈 해결
const corsOptions = {
  origin: 'https://tutoreal.pages.dev',
  methods : "GET, HEAD, POST, PUT, DELETE, OPTIONS",
  credentials: true,
  enablePreflight: true
};
app.use(cors(corsOptions));

app.options('*', cors(corsOptions))

//POST 요청을 받을 수 있게 해주는 코드 (JSON 데이터 읽기)
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//POST 요청이 오먼 3000번 포트에 돌려준다.
app.post('/tutoringSpeak', async function (req, res) {
  //OPTIONS 메소드 관리
  if(req.method === "OPTIONS"){
    res.writeHead(204);
  }

  const headers = {
    'Access-Control-Allow-Origin': 'https://tutoreal.pages.dev',
    'Access-Control-Allow-Methods': 'GET, POST, HEAD, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Credentials': true
  };

  res.set(headers);
  
  //res.set('Access-Control-Allow-Origin', 'https://tutor-app.pages.dev');
  // res.setHeader("Access-Control-Allow-Origin", "https://tutor-app.pages.dev");
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // res.setHeader('Access-Control-Allow-Credentials', true);
  
  let {userMessage, tutorMessage} = req.body
  console.log(req.body)
  // const situation = [
  //   "small talk with friend",
  //   "job interview, and you are an interviewer",
  //   "a movie date",
  //   "first day of college",
  // ];
  
  let messages = [
    {role: "system", content: "You are the world's best English conversation tutor. Nothing is impossible for you, and you can answer any question. You teach English very well and help me to have a good conversation in English. You have extensive knowledge in various fields and carry on conversations well. You role-play for situations I present but please don’t give me the full dialogue all at once. Say one sentence and wait for my response. If I use a grammatically incorrect or awkward sentence, you help me make it sound natural in conversation and give me a chance to say it correctly."},
    {role: "user", content: "You are the world's best English conversation tutor. Nothing is impossible for you, and you can answer any question. You teach English very well and help me to have a good conversation in English. You have extensive knowledge in various fields and carry on conversations well. You role-play for situations I present but please don’t give me the full dialogue all at once. Say one sentence and wait for my response. If I use a grammatically incorrect or awkward sentence, you help me make it sound natural in conversation and give me a chance to say it correctly."},
    {role: "assistant", content: "Thank you for your kind words! I'll do my best to help you improve your English conversation skills. Please feel free to ask me any questions or present any situations you'd like to practice, and I'll be happy to role-play with you and provide feedback to help you improve.To start, let's have a conversation. You can begin by saying a sentence, and I'll respond and we'll take it from there."},
  ];
  
  let lastRole = "assistant"; // assume assistant sent the last message

  while (userMessage.length > 0 || tutorMessage.length > 0) {
    if (lastRole === "assistant" && userMessage.length > 0) {
      messages.push({role: "user", content: userMessage.shift() });
      lastRole = "user";
    } else if (lastRole === "user" && tutorMessage.length > 0) {
      messages.push({role: "assistant", content: tutorMessage.shift() });
      lastRole = "assistant";
    } else {
      break; // both arrays are empty, exit the loop
    }
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    //parameter 조정
    //max_tokens: 100,
    temperature: 0.5,
    //system이랑 user의 초기 prompt 넣어주기
    messages: messages,
  });
  
  //대답을 tutoring 변수에 저장
  let tutoring = completion.data.choices[0].message['content']

  //response를 JSON으로 바꿔줌 
  res.json({"assistant": tutoring});
});



app.post('/recordToText', upload.single('file'), async (req, res) => {
  //OPTIONS 메소드 관련
  if(req.method === "OPTIONS"){
    res.writeHead(204);
  }

  const headers = {
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin': 'https://tutoreal.pages.dev',
    'Access-Control-Allow-Methods': 'GET, POST, HEAD, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Credentials': false,
  };

  res.set(headers);
  
  const filePath = req.file.path;
  console.log(filePath);
  //const fileExtension = path.extname(filePath);
  //console.log('확장자', fileExtension);
  //console.log(req.file.mimetype);
  ////1. axios 사용 방법
  //const whisperTime = process.hrtime();
  //console.log('whisper', req.file);

  // try{
  //   const formData = new FormData();
  //   formData.append("model", "whisper-1");
  //   formData.append("file", fs.createReadStream("/tmp/recording.mp3"), {
  //     filename: req.file.originalname,
  //   });
    
  //   console.log(req.file.path)
  //   console.log(fs.createReadStream(req.file.path))

  //   const resp = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
  //       headers: {
  //         Authorization: "Bearer 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",
  //         "Content-Type": "multipart/form-data",
  //       },
  //     }
  //   );
  //             //"Content-Type": `${req.file.mimetype}`,

  //   console.log(resp);
  
  //   res.send({ apiCall: resp.data, time: process.hrtime(whisperTime) });
  // } catch (e) {
  //   console.log('error', e);
  //   res.status(500).send(new Error(e));
  // }
////2. 일반 방법

  // try {
  //   const resp = await openai.createTranscription(
  //     fs.createReadStream('/tmp/recording.mp3'),
  //     "whisper-1"
  //   );
  //   res.json({text: resp.text});
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json({error: err.message});
  // }

////3. openai community 방

  var audioBuffer = req.file.buffer;
  console.log('hi', audioBuffer);

  const audioStream = Readable.from(audioBuffer);
  
    try {
      const response = await openai.createTranscription(audioStream, "whisper-1");
      res.json({text: response.text});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to transcribe audio." });
    }
  
});

//server less 모듈로 export
module.exports.handler = serverless(app);

//app.listen(3000)

