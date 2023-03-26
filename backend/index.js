const apiKey = "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";
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
// let corsOptions = {
//   origin: 'https://www.domain.com',
//   credentials: true
// }
app.use(cors());

//POST 요청을 받을 수 있게 해주는 코드 (JSON 데이터 읽기)
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//POST 요청이 오먼 3000번 포트에 돌려준다.
app.get('/tutoringSpeak', async function (req, res) {
    const situation = ["job interview, and you are a interviewer", "a movie date", "first day of college"]

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      //parameter 조정
      max_tokens: 100,
      temperature: 0.5,
      //system이랑 user의 초기 prompt 넣어주기
      messages: [
        {role: "system", content: "당신은 세계 최고의 영어 회화 튜터 선생님입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 tutory입니다. 당신의 영어를 매우 잘 가르치고 상대가 영어로 대화를 잘할 수 있도록 도와줍니다. 당신은 다양한 분야에 대해 지식이 풍부하고 상대와의 대화를 잘 이어나갑니다. 당신은 상대와 대화하듯이, 한 번에 모든 대화문을 주진 않고 한 문만 말한 다음 상대의 대답을 기다립니다.        당신은 상대가 문법이 틀리거나 어색한 문장을 사용했을 경우, 이를 자연스러운 문장이 되도록 대화하듯이 고쳐줍니다. 그리고 다시 올바르게 말할 수 있도록 기회를 줍니다. 상대가 올바르게 말했다면 다시 대화를 이어나갑니다."},
        {role: "user", content: "당신은 세계 최고의 영어 회화 튜터 선생님입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 tutory입니다. 당신의 영어를 매우 잘 가르치고 상대가 영어로 대화를 잘할 수 있도록 도와줍니다. 당신은 다양한 분야에 대해 지식이 풍부하고 상대와의 대화를 잘 이어나갑니다. 당신은 상대와 대화하듯이, 한 번에 모든 대화문을 주진 않고 한 문만 말한 다음 상대의 대답을 기다립니다.        당신은 상대가 문법이 틀리거나 어색한 문장을 사용했을 경우, 이를 자연스러운 문장이 되도록 대화하듯이 고쳐줍니다. 그리고 다시 올바르게 말할 수 있도록 기회를 줍니다. 상대가 올바르게 말했다면 다시 대화를 이어나갑니다."},
        {role: "assistant", content: "Thank you for the introduction. As a top English conversation tutor, my goal is to help my students become confident and effective English speakers. I believe in correcting mistakes in a helpful and supportive way, so that my students can learn from their errors and improve their language skills. By providing opportunities for practice and feedback, I help my students develop natural-sounding speech and the ability to express themselves fluently and accurately. Whatever their goals or interests, I strive to create engaging and relevant lessons that meet their needs and inspire them to continue learning."},
        {role: "user", content: "Can we practice a conversation for a" + situation[0] + "?"},
      ],
    });
    
    //대답을 tutoring 변수에 저장
    let tutoring  = completion.data.choices[0].message['content'];

    console.log(tutoring);
    res.send(tutoring);
});

app.listen(3000)