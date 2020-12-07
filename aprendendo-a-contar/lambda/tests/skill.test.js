const va = require("virtual-alexa");
const path = require("path");

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

it("should give an introduction to the user and launch request", async () => {
  const result = await alexa.launch();
  expect(result.response.outputSpeech.ssml).toContain(
    "você quer aprender a contar hoje?"
  );
});

it("should count 1 to 10 after selecting option one", async () => {
  const firstResult = await alexa.launch();

  expect(firstResult.response.outputSpeech.ssml).toContain(
    "você quer aprender a contar hoje?"
  );

  const secondResult = await alexa.intend("AnswerNumberIntent", { number: 1 });

  expect(secondResult.response.outputSpeech.ssml).toContain(
    '<say-as interpret-as="cardinal">1</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">2</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">3</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">4</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">5</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">6</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">7</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">8</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">9</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">10</say-as>'
  );
});

it("should count 11 to 20 after selecting option two", async () => {
  const firstResult = await alexa.launch();

  expect(firstResult.response.outputSpeech.ssml).toContain(
    "você quer aprender a contar hoje?"
  );

  const secondResult = await alexa.intend("AnswerNumberIntent", { number: 2 });

  expect(secondResult.response.outputSpeech.ssml).toContain(
    '<say-as interpret-as="cardinal">11</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">12</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">13</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">14</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">15</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">16</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">17</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">18</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">19</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">20</say-as>'
  );
});

it("should count 21 to 30 after selecting option three", async () => {
  const firstResult = await alexa.launch();

  expect(firstResult.response.outputSpeech.ssml).toContain(
    "você quer aprender a contar hoje?"
  );

  const secondResult = await alexa.intend("AnswerNumberIntent", { number: 3 });

  expect(secondResult.response.outputSpeech.ssml).toContain(
    '<say-as interpret-as="cardinal">21</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">22</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">23</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">24</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">25</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">26</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">27</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">28</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">29</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">30</say-as>'
  );
});

it("should count 31 to 40 after selecting option four", async () => {
  const firstResult = await alexa.launch();

  expect(firstResult.response.outputSpeech.ssml).toContain(
    "você quer aprender a contar hoje?"
  );

  const secondResult = await alexa.intend("AnswerNumberIntent", { number: 4 });

  expect(secondResult.response.outputSpeech.ssml).toContain(
    '<say-as interpret-as="cardinal">31</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">32</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">33</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">34</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">35</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">36</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">37</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">38</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">39</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">40</say-as>'
  );
});

it("should count 41 to 50 after selecting option four", async () => {
  const firstResult = await alexa.launch();

  expect(firstResult.response.outputSpeech.ssml).toContain(
    "você quer aprender a contar hoje?"
  );

  const secondResult = await alexa.intend("AnswerNumberIntent", { number: 5 });

  expect(secondResult.response.outputSpeech.ssml).toContain(
    '<say-as interpret-as="cardinal">41</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">42</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">43</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">44</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">45</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">46</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">47</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">48</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">49</say-as>, <break time="2.0s"/><say-as interpret-as="cardinal">50</say-as>'
  );
});

it("should give an error when select a number greater than 5", async () => {
  const firstResult = await alexa.launch();

  expect(firstResult.response.outputSpeech.ssml).toContain(
    "você quer aprender a contar hoje?"
  );

  const secondResult = await alexa.intend("AnswerNumberIntent", { number: 6 });

  expect(secondResult.response.outputSpeech.ssml).toContain(
    "Desculpe, não encontrei essa opção"
  );
});

it("should show a help message", async () => {
  const result = await alexa.intend("AMAZON.HelpIntent");

  const outputSpeech = result.response.outputSpeech.ssml;

  expect(outputSpeech).toContain(
    "Oi, eu te ajudo a aprender a contar de 1 a 50, basta me abrir e escolher uma opção, tá?"
  );
});

it("should stop the skill", async () => {
  const result = await alexa.intend("AMAZON.StopIntent");

  const outputSpeech = result.response.outputSpeech.ssml;

  expect(outputSpeech).toContain(
    "Você foi ótimo hoje! Se quiser aprender mais, me chame novamente"
  );
});

it("should cancel the skill", async () => {
  const result = await alexa.intend("AMAZON.CancelIntent");

  const outputSpeech = result.response.outputSpeech.ssml;

  expect(outputSpeech).toContain(
    "Você foi ótimo hoje! Se quiser aprender mais, me chame novamente"
  );
});

it("should fallback to no answer when no intent", async () => {
  const result = await alexa.intend("AMAZON.FallbackIntent", {});

  const outputSpeech = result.response.outputSpeech.ssml;

  expect(outputSpeech).toContain(
    "Desculpe, eu não consegui te entender. Me chama novamente"
  );
});

it("should end the skill", async () => {
  const shouldEndSession = await alexa
    .request()
    .requestType("SessionEndedRequest")
    .send();

  expect(shouldEndSession).toBeTruthy();
});
