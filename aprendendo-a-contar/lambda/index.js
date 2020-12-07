const Alexa = require("ask-sdk-core");

const countOptions = `
Opção 1. <break time="0.5s"/> De <say-as interpret-as="cardinal">1</say-as> a 10 
<break time="0.5s"/>. Opção 2. <break time="0.2s"/> De 11 a 20 
<break time="0.5s"/>. Opção 3. <break time="0.2s"/> De 21 a 30 
<break time="0.5s"/> Opção 4. <break time="0.2s"/> De 31 a 40 
<break time="0.5s"/>ou Opção 5. de 41 a 50. Escolha uma opção e vamos aprender
`;

/* *
 * LaunchRequestHandler is the entry point of this Alexa Skill
 * */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    const speakOutput = `Vamos lá! O que você quer aprender a contar hoje? 
        ${countOptions}`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

/* *
 * AnswerNumberIntent triggers when a customer says something that map to a answer state
 * */
const AnswerNumberIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AnswerNumberIntent"
    );
  },
  handle(handlerInput) {
    const optionSelected = Number(
      handlerInput.requestEnvelope.request.intent.slots.number.value
    );

    if (!optionSelected || optionSelected < 1 || optionSelected > 5) {
      return handlerInput.responseBuilder
        .speak("Desculpe, não encontrei essa opção")
        .reprompt("Eu só tenho 5 opções, vou repetir, tá?")
        .getResponse();
    }

    const startNumber = [0, 10, 20, 30, 40];

    const numbers = new Array(10)
      .fill(0)
      .map(
        (value, index) =>
          `<say-as interpret-as="cardinal">${
            startNumber[optionSelected - 1] + index + 1
          }</say-as>`
      );
    const speakOutput = `Vamos lá, vou começar: <break time="1.0s"/> ${numbers.join(
      ', <break time="2.0s"/>'
    )} 
            <break time="2.0s"/> Muito bem! Você foi ótimo! 
            Se quiser aprender mais me chame novamente. Até mais`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

/* *
 * HelpIntent triggers when a customer says something that map to a help state
 * */
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "Oi, eu te ajudo a aprender a contar de 1 a 50, basta me abrir e escolher uma opção, tá?";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(countOptions)
      .getResponse();
  },
};

/* *
 * CancelAndStopIntent triggers when a customer says something that map to a cancel state
 * */
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "Você foi ótimo hoje! Se quiser aprender mais, me chame novamente";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "Desculpe, eu não consegui te entender. Me chama novamente";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    console.log(
      `~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`
    );

    return handlerInput.responseBuilder.getResponse();
  },
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput =
      "Humm, alguma coisa aconteceu de errado, desculpa. Me chama novamente";
    console.log(`~~~~ Error handled: ${JSON.stringify(error.message)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    AnswerNumberIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
