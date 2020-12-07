const va = require("virtual-alexa");
const path = require("path");
const jokes = require("../jokes");

const alexa = va.VirtualAlexa.Builder()
  .handler("index.handler")
  .interactionModelFile(
    path.join(
      __dirname,
      "..",
      "..",
      "interactionModels",
      "custom",
      "pt-BR.json"
    )
  )
  .create();

it("should give a joke on launch", async () => {
  const result = await alexa.launch();

  const outputSpeech = result.response.outputSpeech.ssml;

  let valid = false;

  for (let i = 0; i < jokes.MEMES.length; i++) {
    if (outputSpeech.indexOf(jokes.MEMES[i])) {
      valid = true;
      break;
    }
  }

  expect(valid).toBeTruthy();
});

it("should stop the skill", async () => {
  const result = await alexa.intend("AMAZON.StopIntent");

  const outputSpeech = result.response.outputSpeech.ssml;

  expect(outputSpeech).toContain("Tchau! Volte para mais piadas!");
});

it("should cancel the skill", async () => {
  const result = await alexa.intend("AMAZON.CancelIntent");

  const outputSpeech = result.response.outputSpeech.ssml;

  expect(outputSpeech).toContain("Ok. Cancelado!");
});

it("should fallback to no answer when no intent", async () => {
  const result = await alexa.intend("AMAZON.NoIntent", {});

  const outputSpeech = result.response.outputSpeech.ssml;

  expect(outputSpeech).toContain("Não sei responder isso!");
});

it("should end the skill", async () => {
  const shouldEndSession = await alexa
    .request()
    .requestType("SessionEndedRequest")
    .send();

  expect(shouldEndSession).toBeTruthy();
});
