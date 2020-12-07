/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require("ask-sdk-core");
const jokes = require("./jokes");

const SKILL_NAME = "Memes Para Cegos";
const FALLBACK_MESSAGE = `Infelizmente aconteceu um erro!`;
const FALLBACK_REPROMPT = "Como posso te ajudar?";
const APL_DOC = require("./document/renderPage.json");
const TWO_PAGER_COMMANDS = require("./document/twoSpeakItemsCommand.json");
const ONE_PAGER_COMMANDS = require("./document/oneSpeakItemCommand.json");
const TOKEN_ID = "pagerSample";
const firstTransformerList = [
  {
    inputPath: "phraseSsml",
    outputName: "phraseAsSpeech",
    transformer: "ssmlToSpeech",
  },
];
const secondTransformerList = [
  {
    inputPath: "phraseSsml",
    outputName: "nextPhraseAsSpeech",
    transformer: "ssmlToSpeech",
  },
];

function makePage(
  phraseText = "",
  repromptText = "",
  phraseSSMLProperty = "",
  transformerList = []
) {
  return {
    phraseText: phraseText,
    repromptText: repromptText,
    properties: {
      phraseSsml: phraseSSMLProperty,
    },
    transformers: transformerList,
  };
}

function supportsDisplay(handlerInput) {
  return (
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    (handlerInput.requestEnvelope.context.System.device.supportedInterfaces[
      "Alexa.Presentation.APL"
    ] ||
      handlerInput.requestEnvelope.context.System.device.supportedInterfaces
        .Display) &&
    handlerInput.requestEnvelope.context.Viewport
  );
}

function randomJoke(handlerInput) {
  const sessionAttributes = {};

  const arrJokes = jokes.MEMES;

  const joke = arrJokes[Math.floor(Math.random() * (arrJokes.length - 1))];

  Object.assign(sessionAttributes, {
    speechOutput: joke,
  });

  handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

  return handlerInput.responseBuilder
    .speak(joke)
    .reprompt(joke)
    .withSimpleCard("Memes para cegos", joke)
    .withShouldEndSession(true)
    .getResponse();
}

const LaunchRequest = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return (
      request.type === "LaunchRequest" ||
      (request.type === "IntentRequest" &&
        request.intent.name === "AMAZON.StartOverIntent")
    );
  },
  handle(handlerInput) {
    return randomJoke(handlerInput);
  },
};

const SessionEndedRequest = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`
    );

    return handlerInput.responseBuilder.getResponse();
  },
};

const StopIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.StopIntent"
    );
  },
  handle(handlerInput) {
    let speechOutput = "Tchau! Volte para mais piadas!";
    if (supportsDisplay(handlerInput)) {
      let payload = {
        phrase: makePage(
          speechOutput,
          speechOutput,
          `<speak>${speechOutput}</speak>`,
          firstTransformerList
        ),
        nextPhrase: makePage(
          "none",
          "<speak></speak>",
          "<speak></speak>",
          secondTransformerList
        ),
      };
      speechOutput = "";

      handlerInput.responseBuilder
        .addDirective({
          type: "Alexa.Presentation.APL.RenderDocument",
          version: "1.1",
          document: APL_DOC,
          datasources: payload,
          token: TOKEN_ID,
        })
        .addDirective({
          type: "Alexa.Presentation.APL.ExecuteCommands",
          token: TOKEN_ID,
          commands: [ONE_PAGER_COMMANDS],
        });
    }
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const CancelIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.CancelIntent"
    );
  },
  handle(handlerInput) {
    let speechOutput = "Ok. Cancelado!";
    if (supportsDisplay(handlerInput)) {
      let payload = {
        phrase: makePage(
          speechOutput,
          speechOutput,
          `<speak>${speechOutput}</speak>`,
          firstTransformerList
        ),
        nextPhrase: makePage(
          "none",
          "<speak></speak>",
          "<speak></speak>",
          secondTransformerList
        ),
      };
      speechOutput = "";
      handlerInput.responseBuilder
        .addDirective({
          type: "Alexa.Presentation.APL.RenderDocument",
          version: "1.1",
          document: APL_DOC,
          datasources: payload,
          token: TOKEN_ID,
        })
        .addDirective({
          type: "Alexa.Presentation.APL.ExecuteCommands",
          token: TOKEN_ID,
          commands: [ONE_PAGER_COMMANDS],
        });
    }
    return handlerInput.responseBuilder.speak(speechOutput).getResponse();
  },
};

const NoIntent = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent"
    );
  },
  handle(handlerInput) {
    let speechOutput = "Não sei responder isso!";
    if (supportsDisplay(handlerInput)) {
      let payload = {
        phrase: makePage(
          speechOutput,
          "",
          `<speak>${speechOutput}</speak>`,
          firstTransformerList
        ),
        nextPhrase: makePage(
          "none",
          "<speak></speak>",
          "<speak></speak>",
          secondTransformerList
        ),
      };
      speechOutput = "";
      handlerInput.responseBuilder
        .addDirective({
          type: "Alexa.Presentation.APL.RenderDocument",
          version: "1.1",
          document: APL_DOC,
          datasources: payload,
          token: TOKEN_ID,
        })
        .addDirective({
          type: "Alexa.Presentation.APL.ExecuteCommands",
          token: TOKEN_ID,
          commands: [ONE_PAGER_COMMANDS],
        });
    }
    return handlerInput.responseBuilder.speak(speechOutput).getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    let speechOutput = "Eu não entendi";
    const repromptText = speechOutput;
    if (supportsDisplay(handlerInput)) {
      let payload = {
        phrase: makePage(
          speechOutput,
          speechOutput,
          `<speak>${speechOutput}</speak>`,
          firstTransformerList
        ),
        nextPhrase: makePage(
          "none",
          "<speak></speak>",
          "<speak></speak>",
          secondTransformerList
        ),
      };
      speechOutput = "";
      handlerInput.responseBuilder
        .addDirective({
          type: "Alexa.Presentation.APL.RenderDocument",
          version: "1.1",
          document: APL_DOC,
          datasources: payload,
          token: TOKEN_ID,
        })
        .addDirective({
          type: "Alexa.Presentation.APL.ExecuteCommands",
          token: TOKEN_ID,
          commands: [TWO_PAGER_COMMANDS],
        });
    }
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(repromptText)
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequest,
    StopIntent,
    CancelIntent,
    NoIntent,
    SessionEndedRequest
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
