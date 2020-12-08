const Alexa = require("ask-sdk-core");
const api = require("./services/api");

const formatNumberToBRL = require("./utils/formatNumber");

const AMAZONCancelIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.CancelIntent"
    );
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;

    let say = "Ok, sempre estou aqui! Volte sempre";

    return responseBuilder.speak(say).withShouldEndSession(true).getResponse();
  },
};

const AMAZONHelpIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;

    let say =
      "Você pediu minha ajuda. Você pode me perguntar qual valor do dólar hoje, por exemplo e eu te responderei ";

    return responseBuilder.speak(say).reprompt(say).getResponse();
  },
};

const AMAZONStopIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.StopIntent"
    );
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;

    let say = "Ok, sempre estou aqui! Volte sempre!";

    return responseBuilder.speak(say).withShouldEndSession(true).getResponse();
  },
};

const ConvertDollarHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "ConvertDollar"
    );
  },
  async handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const responseBuilder = handlerInput.responseBuilder;

    let { BRL } = request.intent.slots;
    const { data } = await api.get("/json/all/USD-BRL");

    if (!BRL || !BRL.value || BRL.value == "?") {
      BRL = { value: 1 };
    }

    let say = `R$${
      BRL.value
    } está custando aproximadamente $${formatNumberToBRL(
      Number(BRL.value) / Number(data.USD.bid)
    )}`;

    return responseBuilder.speak(say).reprompt(say).getResponse();
  },
};

const ConvertBRLHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" && request.intent.name === "ConvertBRL"
    );
  },
  async handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const responseBuilder = handlerInput.responseBuilder;

    let { USD } = request.intent.slots;
    const { data } = await api.get("/json/all/USD-BRL");

    if (!USD || !USD.value || USD.value == "?") {
      USD = { value: 1 };
    }

    let say = `$${
      USD.value
    } está custando aproximadamente R$${formatNumberToBRL(
      Number(USD.value) * Number(data.USD.bid)
    )}`;

    return responseBuilder.speak(say).reprompt(say).getResponse();
  },
};

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "LaunchRequest";
  },
  async handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;

    const { data } = await api.get("/json/all/USD-BRL");

    let say = `$1 hoje está custando aproximadamente R$${formatNumberToBRL(
      data.USD.bid
    )}`;

    return responseBuilder.speak(say).reprompt(say).getResponse();
  },
};

const SessionEndedHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`
    );
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(
        `Estou com problemas para buscar o dólar. Tente novamente mais tarde`
      )
      .reprompt(
        `Estou com problemas para buscar o dólar. Tente novamente mais tarde`
      )
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    ConvertDollarHandler,
    ConvertBRLHandler,
    LaunchRequestHandler,
    SessionEndedHandler,
    AMAZONCancelIntentHandler,
    AMAZONHelpIntentHandler,
    AMAZONStopIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
