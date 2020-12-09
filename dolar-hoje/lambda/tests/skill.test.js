const va = require("virtual-alexa");
const path = require("path");

const api = require("../services/api");

const formatNumber = require("../utils/formatNumber");

jest.spyOn(api, "get").mockImplementation(() => {
  return {
    data: {
      USD: {
        bid: 4.03,
      },
    },
  };
});

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

it("should show the today's dolar value", async () => {
  const result = await alexa.launch();

  expect(result.response.outputSpeech.ssml).toContain(
    "$1 hoje está custando aproximadamente R$4,03"
  );
});

it("should calculate BRL value based on dollar amount given", async () => {
  const result = await alexa.intend("ConvertDollar", { BRL: 20 });

  expect(result.response.outputSpeech.ssml).toContain(formatNumber(4.96));
});

it("should calculate dollar value based on reais amount given", async () => {
  const result = await alexa.intend("ConvertBRL", { USD: 20 });

  expect(result.response.outputSpeech.ssml).toContain(formatNumber(80.6));
});

it("should stop the skill", async () => {
  const result = await alexa.intend("AMAZON.StopIntent");

  const outputSpeech = result.response.outputSpeech.ssml;

  expect(outputSpeech).toContain("Ok, sempre estou aqui! Volte sempre!");
});

it("should cancel the skill", async () => {
  const result = await alexa.intend("AMAZON.CancelIntent");

  const outputSpeech = result.response.outputSpeech.ssml;

  expect(outputSpeech).toContain("Ok, sempre estou aqui! Volte sempre");
});

it("should end the skill", async () => {
  const shouldEndSession = await alexa
    .request()
    .requestType("SessionEndedRequest")
    .send();

  expect(shouldEndSession).toBeTruthy();
});
