const axios = require("axios");

const api = axios.create({
  baseURL: "https://economia.awesomeapi.com.br/",
});

module.exports = api;
