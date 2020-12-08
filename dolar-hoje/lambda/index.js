const Alexa = require("ask-sdk-core");
const api = require("./services/api");

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

    const { BRL = 1 } = request.intent.slots;
    const { data } = await api.get("/json/all/USD-BRL");

    let say = `<say-as interpret-as="currency">${BRL.value}</say-as> ${
      BRL.value > 1 ? "reais" : "real"
    } está custando <say-as interpret-as="currency">${(
      Number(BRL.value) / Number(data.USD.bid)
    ).toFixed(2)}</say-as> dólares`;

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

    let say = `Um dolar hoje está custando <say-as interpret-as="currency">${data.USD.bid}</say-as> reais`;

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
    LaunchRequestHandler,
    SessionEndedHandler,
    AMAZONCancelIntentHandler,
    AMAZONHelpIntentHandler,
    AMAZONStopIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
