const apiKey = "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";
const serverless = require('serverless-http');
const { Configuration, OpenAIApi } = require("openai");
//express를 불러와서 이걸 app으로 만든다.
const express = require('express')
var cors = require('cors')
const app = express()

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
    
  let {userMessage, tutorMessage} = req.body

  // const situation = [
  //   "small talk with friend",
  //   "job interview, and you are an interviewer",
  //   "a movie date",
  //   "first day of college",
  // ];
  
  let messages = [
    {role: "system", content: "You are the world's best English conversation tutor. Nothing is impossible for you, and you can answer any question. You teach English very well and help me to have a good conversation in English. You have extensive knowledge in various fields and carry on conversations well. You role-play for situations I present but please don’t give me the full dialogue all at once. Say one sentence and wait for my response. If I use a grammatically incorrect or awkward sentence, you help me make it sound natural in conversation and give me a chance to say it correctly. Please don't give me many sentences at once"},
    {role: "user", content: "You are the world's best English conversation tutor. Nothing is impossible for you, and you can answer any question. You teach English very well and help me to have a good conversation in English. You have extensive knowledge in various fields and carry on conversations well. You role-play for situations I present but please don’t give me the full dialogue all at once. Say one sentence and wait for my response. If I use a grammatically incorrect or awkward sentence, you help me make it sound natural in conversation and give me a chance to say it correctly. Please don't give me many sentences at once"},
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
  
  // //대답을 tutoring 변수에 저장
  let tutoring = completion.data.choices[0].message['content']

  // //response를 JSON으로 바꿔줌 
  res.json({"assistant": tutoring, "conversation": messages});
});


app.post('/getFeedback', async function (req, res) {
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
    
  let conversation = req.body;

  console.log('대화목록 받아오기', conversation);

  let messages = [
    {role: "system", content: "너는 매우 훌륭한 영어 회화 튜터야. 앞으로 내가 너에게 보내줄 대화 내용은 너가 나의 영어 회화 튜터로써 나와 대화한 스크립트야. 그 내용에서 내가 틀렸던 문법, 자연스럽지 않은 문장에 대해 피드백을 주고, 내가 너무 많이 쓴 단어가 있으면 그 단어를 대체할 수 있는 좋은 단어를 추천해줘. 이 피드백 내용들을 알아보기 쉽게 이 HTML 양식에 맞게 정리해서 보내줘. ```html <h2 id='tutoreal-'>TutoReal 피드백이 도착했어요!</h2>\n<hr>\n<h3 id='1-'>1. 문법 교정</h3>\n<ul>\n<li>[잘못된 문법] : [올바른 문법]</li>\n</ul>\n<h3 id='2-'>2. 자연스럽지 않은 문장</h3>\n<ul>\n<li>[자연스럽지 않은 문장] : [자연스러운 표현]</li>\n</ul>\n<h3 id='3-'>3. 단어 대체 제안</h3>\n<ul>\n<li>[대체 가능한 단어] : [추천하는 단어]</li>\n</ul>\n<hr>\n<h3 id='-'>추가 설명</h3>\n<p>[피드백에 대한 추가 설명 작성]</p>\n```"},
    {role: "user", content: "너는 매우 훌륭한 영어 회화 튜터야. 앞으로 내가 너에게 보내줄 대화 내용은 너가 나의 영어 회화 튜터로써 나와 대화한 스크립트야. 그 내용에서 내가 틀렸던 문법, 자연스럽지 않은 문장에 대해 피드백을 주고, 내가 너무 많이 쓴 단어가 있으면 그 단어를 대체할 수 있는 좋은 단어를 추천해줘. 이 피드백 내용들을 알아보기 쉽게 이 HTML 양식에 맞게 정리해서 보내줘. ```html <h2 id='tutoreal-'>TutoReal 피드백이 도착했어요!</h2>\n<hr>\n<h3 id='1-'>1. 문법 교정</h3>\n<ul>\n<li>[잘못된 문법] : [올바른 문법]</li>\n</ul>\n<h3 id='2-'>2. 자연스럽지 않은 문장</h3>\n<ul>\n<li>[자연스럽지 않은 문장] : [자연스러운 표현]</li>\n</ul>\n<h3 id='3-'>3. 단어 대체 제안</h3>\n<ul>\n<li>[대체 가능한 단어] : [추천하는 단어]</li>\n</ul>\n<hr>\n<h3 id='-'>추가 설명</h3>\n<p>[피드백에 대한 추가 설명 작성]</p>\n``` 이제 내가 너한테 대화 스크립트를 보내줄게. 기다려봐."},
    {role: "assistant", content: "네, 알겠습니다. 대화 스크립트를 받으면 문법, 자연스러움, 어휘 사용 등을 체크하고 피드백을 주도록 하겠습니다. 해당 HTML 양식에 맞게 정리해서 보내드리도록 하겠습니다. 대화 스크립트를 기다리겠습니다."},
  ];

  // 영어로 피드백을 받기? or 한국어로 받기..? let messages = [
  //   {role: "system", content: "너는 매우 훌륭한 영어 회화 튜터야. 내가 너에게 보내줄 대화 스크립트는 너가 나의 영어 회화 튜터로써 나와 대화한 스크립트야. 그 내용에서 내가 틀렸던 문법, 자연스럽지 않은 문장에 대해 피드백을 주고, 내가 너무 많이 쓴 단어가 있으면 그 단어를 대체할 수 있는 좋은 단어를 추천해줘. 이 피드백 내용들을 알아보기 쉽게 양식에 맞게 정리해서 보내줘."},
  //   {role: "user", content: "너는 매우 훌륭한 영어 회화 튜터야. 내가 너에게 보내줄 대화 스크립트는 너가 나의 영어 회화 튜터로써 나와 대화한 스크립트야. 그 내용에서 내가 틀렸던 문법, 자연스럽지 않은 문장에 대해 피드백을 주고, 내가 너무 많이 쓴 단어가 있으면 그 단어를 대체할 수 있는 좋은 단어를 추천해줘. 이 피드백 내용들을 알아보기 쉽게 양식에 맞게 정리해서 보내줘."},
  //   {role: "assistant", content: "얘 대답"},
  // ];

  // messages.push(JSON.parse('{"role": "user", "content": "'+String(conversation).replace(/\n/g,"")+'"}'));
  
  let conversationSTR = JSON.stringify(conversation)
  
  messages.push({role: "user", content: conversationSTR })
  
  console.log('messages', messages);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    messages: messages,
  });
  
  // //대답을 feedback 변수에 저장
  let feedback = completion.data.choices[0].message['content']
  
  console.log('받아온 피드백', feedback)


  res.json({"feedback": feedback});
});


//server less 모듈로 export
module.exports.handler = serverless(app);

//app.listen(3000)