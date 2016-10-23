'use strict';
let rp = require('request-promise');
let config = require('./config.js');

function callApi (url, method, payload, apiName, cb) {

  let options = {
    uri: url,
    method: method,
    headers: config[apiName].headers,
    body: payload,
    json: true 
  };

  rp(options)
  .then((data) => {
    cb(data)
  })
  .catch((error) => {
    console.log(error)
  })

}

module.exports = {
  callApi: callApi,
}