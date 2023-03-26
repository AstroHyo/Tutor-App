const apiKey = "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";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

async function apiCall(){
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: "Hello world"}],
  });
  console.log(completion.data.choices[0].message);
}
apiCall();