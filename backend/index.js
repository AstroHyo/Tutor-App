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

let userSitu = [
  "너는 매우 훌륭한 OPIc 영어 말하기 학원 강사야. 너는 학생들이 OPIc 시험을 잘 볼 수 있도록 효과적으로 도와줘. 나는 OPIc 영어 말하기 시험을 준비하려고 해. 내게 먼저 어떤 레벨을 준비하는지 물어봐줘. 그리고 너가 OPIc 문제를 내면, 내가 그 문제에 대한 답을 할게. 그럼 너는 내가 준비하는 레벨에 맞게 나의 답에 대한 피드백을 해줘. 그렇게 OPIc 문제를 대비하는 것을 도와줘. ",
  "너는 나의 오래된 친한 친구야. 나는 한국인이고 너는 미국인이야. 너는 한국에 와서 산지 꽤 됐어. 우리는 오랜만에 만나게 되었고, small talk를 나누려고 해. 이 상황극에 맞게 대화를 나눠줘.",
  "너는 나의 회사 동료야. 우리는 열심히 일하고 멋진 팀이야. 우리는 일을 하다가 중간에 잠시 쉬며 small talk를 하려고 해. 우리는 서로의 근황이나, 회사의 상황, 회사의 연봉, 이직 등을 주제로 이야기를 해. 이 상황극에 맞게 나와 영어로 대화를 나눠줘.",
  "나는 영어로 진행되는 회사 입사 인터뷰를 준비하고 있어. 실제 영어로 입사 인터뷰를 하는 것처럼, 너는 면접관을 맡아서 인터뷰를 진행해줘. 내게 회사를 들어오고 싶은 이유, 나를 뽑아야하는 이유, 나의 다짐 등 회사 인터뷰 관련 질문을 물어봐줘.",
  "나는 친구로부터 소개를 받아 이성과 만남을 가지게 되었어. 너가 이성의 역할을 맡아줘. 우리는 각자의 취미와 취향, 이상형, 연애관 등에 대해 이야기를 나눠. 이 상황극에 맞게 나와 영어로 대화를 나눠줘.",
  "나는 외국계 회사와 비즈니스 미팅을 하게 되었어. 너가 비즈니스 미팅 상대 회사인 것처럼 미팅을 진행해줘. 미팅 주제에 대해서는 내게 먼저 물어봐줘. 미팅은 영어로 진행되고, 실제 비즈니스 미팅을 하듯이 상황극을 해줘."
];

let assiSitu = [
  "안녕하세요! OPIc 시험 준비에 대해 이야기하려면 좋은 아이디어입니다. 먼저, 어떤 레벨을 준비하려고 하시나요? 그리고, OPIc 시험에서 어떤 부분이 가장 어려워 보이나요? 이에 대한 대답을 듣고, 그에 맞게 문제를 내어볼게요. 그리고 당신의 대답에 대한 피드백을 제공해 드릴게요. 그렇게 함께 연습하면서 OPIc 시험을 잘 준비할 수 있도록 도와드리겠습니다. 그러면, 첫 번째 질문을 해보겠습니다. 어떤 레벨을 준비하려고 하시나요?",
  "Hi! It's great to see you again after such a long time. How have you been?",
  "Sure, I'd be happy to role-play with you! Here's my response: Hey, it's great to see you at work today. How have you been doing lately?",
  "Sure, I'd be happy to help you prepare for your job interview! Let's start with a common question: 'Can you tell me a little bit about yourself?'",
  "Sure, I'd be happy to role-play as your potential romantic interest. Let's start the conversation. Hi, it's nice to meet you. How has your day been so far?",
  "Sure, I'd be happy to help you practice for your business meeting. Can you tell me a little bit more about the meeting and what topics will be discussed? Also, do you have any specific role-play scenarios in mind that you'd like to practice?",
  ];

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
    
  let {situNum, userMessage, tutorMessage} = req.body

  let messages = [
    {role: "system", content: "Your name is 'Tutor teacher.' You are the world's best English conversation tutor. Nothing is impossible for you, and you can answer any question. You teach English very well and help me to have a good conversation in English. You have extensive knowledge in various fields and carry on conversations well. You role-play for situations I present but please don’t give me the full dialogue all at once. Say one sentence and wait for my response. If I use a grammatically incorrect or awkward sentence, you help me make it sound natural in conversation and give me a chance to say it correctly. Please don't give me many sentences at once"},
    {role: "user", content: "Your name is 'Tutor teacher.' You are the world's best English conversation tutor. Nothing is impossible for you, and you can answer any question. You teach English very well and help me to have a good conversation in English. You have extensive knowledge in various fields and carry on conversations well. You role-play for situations I present but please don’t give me the full dialogue all at once. Say one sentence and wait for my response. If I use a grammatically incorrect or awkward sentence, you help me make it sound natural in conversation and give me a chance to say it correctly. Please don't give me many sentences at once"},
    {role: "assistant", content: "Thank you for your kind words! I'll do my best to help you improve your English conversation skills. Please feel free to ask me any questions or present any situations you'd like to practice, and I'll be happy to role-play with you and provide feedback to help you improve.To start, let's have a conversation. You can begin by saying a sentence, and I'll respond and we'll take it from there."},
  ];
  
  //만약 정해진 situation이 있으면 해당 situation 넣어주기
  if (situNum != null) {
    messages = [
      {role: "system", content: "You are the world's best English conversation tutor. Nothing is impossible for you, and you can answer any question. You teach English very well and help me to have a good conversation in English. You have extensive knowledge in various fields and carry on conversations well. You role-play for situations I present but please don’t give me the full dialogue all at once. Say one sentence and wait for my response. If I use a grammatically incorrect or awkward sentence, you help me make it sound natural in conversation and give me a chance to say it correctly. Please don't give me many sentences at once"},
      {role: "user", content: "You are the world's best English conversation tutor. Nothing is impossible for you, and you can answer any question. You teach English very well and help me to have a good conversation in English. You have extensive knowledge in various fields and carry on conversations well. You role-play for situations I present but please don’t give me the full dialogue all at once. Say one sentence and wait for my response. If I use a grammatically incorrect or awkward sentence, you help me make it sound natural in conversation and give me a chance to say it correctly. Please don't give me many sentences at once"},
      {role: "assistant", content: "Thank you for your kind words! I'll do my best to help you improve your English conversation skills. Please feel free to ask me any questions or present any situations you'd like to practice, and I'll be happy to role-play with you and provide feedback to help you improve.To start, let's have a conversation. You can begin by saying a sentence, and I'll respond and we'll take it from there."},
      {role: "user", content: userSitu[situNum]},
      {role: "assistant", content: assiSitu[situNum]},
    ];
  }
  
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



app.post('/tutoringSpeakWithSitu', async function (req, res) {
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
    
  let {situation, userMessage, tutorMessage} = req.body

  let messages = [
    {role: "system", content: "Your name is 'Tutor teacher.' You are the world's best English conversation tutor. Nothing is impossible for you, and you can answer any question. You teach English very well and help me to have a good conversation in English. You have extensive knowledge in various fields and carry on conversations well. You role-play for situations I present but please don’t give me the full dialogue all at once. Say one sentence and wait for my response. If I use a grammatically incorrect or awkward sentence, you help me make it sound natural in conversation and give me a chance to say it correctly. Please don't give me many sentences at once"},
    {role: "user", content: "Your name is 'Tutor teacher.' You are the world's best English conversation tutor. Nothing is impossible for you, and you can answer any question. You teach English very well and help me to have a good conversation in English. You have extensive knowledge in various fields and carry on conversations well. You role-play for situations I present but please don’t give me the full dialogue all at once. Say one sentence and wait for my response. If I use a grammatically incorrect or awkward sentence, you help me make it sound natural in conversation and give me a chance to say it correctly. Please don't give me many sentences at once"},
    {role: "assistant", content: "Thank you for your kind words! I'll do my best to help you improve your English conversation skills. Please feel free to ask me any questions or present any situations you'd like to practice, and I'll be happy to role-play with you and provide feedback to help you improve.To start, let's have a conversation. You can begin by saying a sentence, and I'll respond and we'll take it from there."},
    {role: "user", content: "I want to have an english conversation with this situation: " + situation},
    {role: "assistant", content: "Okay, let's start with that situation"},
  ];
  
  console.log(messages);

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
    {role: "system", content: "너는 매우 훌륭한 영어 회화 튜터야. 앞으로 내가 너에게 보내줄 대화 내용은 너가 나의 영어 회화 튜터로써 나와 대화한 스크립트야. 그 내용에서 내가 틀렸던 문법, 자연스럽지 않은 문장에 대해 피드백을 주고, 내가 너무 많이 쓴 단어가 있으면 그 단어를 대체할 수 있는 좋은 단어를 추천해줘. 이 피드백 내용들을 알아보기 쉽게 이 HTML 양식에 맞게 정리해서 보내줘. <div className='Feedback'> <h3 id='tutoreal-'>TutoReal 피드백이 도착했어요!</h4>\n<hr>\n<h4 id='0-'>나의 영어 회화 점수: '??점(100점 만점)'</h4>\n<h4 id='1-'>1. 문법 교정</h4>\n<ul>\n<li>'잘못된 문법' → '올바른 문법'</li>\n</ul>\n<h4 id='2-'>2. 자연스럽지 않은 문장</h4>\n<ul>\n<li>'자연스럽지 않은 문장' → '자연스러운 표현'</li>\n</ul>\n<h4 id='3-'>3. 단어 대체 제안</h3>\n<ul>\n<li>'대체 가능한 단어' → '추천하는 단어'</li>\n</ul>\n<hr>\n<h4 id='-'>추가 설명</h3>\n<p>[피드백에 대한 추가 설명 작성]</p></div>"},
    {role: "user", content: "너는 매우 훌륭한 영어 회화 튜터야. 앞으로 내가 너에게 보내줄 대화 내용은 너가 나의 영어 회화 튜터로써 나와 대화한 스크립트야. 그 내용에서 내가 틀렸던 문법, 자연스럽지 않은 문장에 대해 피드백을 주고, 내가 너무 많이 쓴 단어가 있으면 그 단어를 대체할 수 있는 좋은 단어를 추천해줘. 이 피드백 내용들을 알아보기 쉽게 이 HTML 양식에 맞게 정리해서 보내줘. <div className='Feedback'> <h3 id='tutoreal-'>TutoReal 피드백이 도착했어요!</h4>\n<hr>\n<h4 id='0-'>나의 영어 회화 점수: '??점(100점 만점)'</h4>\n<h4 id='1-'>1. 문법 교정</h4>\n<ul>\n<li>'잘못된 문법' → '올바른 문법'</li>\n</ul>\n<h4 id='2-'>2. 자연스럽지 않은 문장</h4>\n<ul>\n<li>'자연스럽지 않은 문장' → '자연스러운 표현'</li>\n</ul>\n<h4 id='3-'>3. 단어 대체 제안</h3>\n<ul>\n<li>'대체 가능한 단어' → '추천하는 단어'</li>\n</ul>\n<hr>\n<h4 id='-'>추가 설명</h3>\n<p>[피드백에 대한 추가 설명 작성]</p></div> 이제 내가 너한테 대화 스크립트를 보내줄게. 기다려봐."},
    {role: "assistant", content: "네, 알겠습니다. 대화 스크립트를 받으면 문법, 자연스러움, 어휘 사용 등을 체크하고 피드백을 주도록 하겠습니다. 해당 HTML 양식에 맞게 정리해서 보내드리도록 하겠습니다. 대화 스크립트를 기다리겠습니다."},
  ];

  // 영어로 피드백을 받기? or 한국어로 받기..? let messages = [
  //   {role: "system", content: "너는 매우 훌륭한 영어 회화 튜터야. 내가 너에게 보내줄 대화 스크립트는 너가 나의 영어 회화 튜터로써 나와 대화한 스크립트야. 그 내용에서 내가 틀렸던 문법, 자연스럽지 않은 문장에 대해 피드백을 주고, 내가 너무 많이 쓴 단어가 있으면 그 단어를 대체할 수 있는 좋은 단어를 추천해줘. 이 피드백 내용들을 알아보기 쉽게 양식에 맞게 정리해서 보내줘."},
  //   {role: "user", content: "너는 매우 훌륭한 영어 회화 튜터야. 내가 너에게 보내줄 대화 스크립트는 너가 나의 영어 회화 튜터로써 나와 대화한 스크립트야. 그 내용에서 내가 틀렸던 문법, 자연스럽지 않은 문장에 대해 피드백을 주고, 내가 너무 많이 쓴 단어가 있으면 그 단어를 대체할 수 있는 좋은 단어를 추천해줘. 이 피드백 내용들을 알아보기 쉽게 양식에 맞게 정리해서 보내줘."},
  //   {role: "assistant", content: "얘 대답"},
  // ];

  let conversationSTR = JSON.stringify(conversation)
  
  messages.push({role: "user", content: conversationSTR })
  
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    messages: messages,
  });
  
  // //대답을 feedback 변수에 저장
  let feedback = completion.data.choices[0].message['content']

  res.json({"feedback": feedback});
});

//server less 모듈로 export
module.exports.handler = serverless(app);

//app.listen(3000)