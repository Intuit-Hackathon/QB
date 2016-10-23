'use strict';
let rp = require('request-promise');
let config = require('./config.js');
let urls = require('./urls.js');
let twilio = require('twilio')(config.twilio.ACCOUNT_SID, config.twilio.AUTH_TOKEN);
let Promise = require('bluebird');

let customerArray = [{number: "+17184061667"}, {number: "+18056371990"}, {number: "+14086443675"}];

function callApi (url, method, payload, headers, cb) {

  let options = {
    uri: url,
    method: method,
    headers: headers,
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

function ree(input,sessionInfo) {
    if (sessionInfo==true) {
        let ses = true;
    }
    else {
        let ses = false;
    }
    let result = {
     "version": "1.0",
     "response": {
       "outputSpeech": {
         "type": "PlainText",
         "text": input
       },
       "card": {
         "type": "Simple",
         "title": "HelloWorld",
         "content": input
       },
       "reprompt": {
         "outputSpeech": {
    "type": "PlainText",
    "text": "Welcome to the Alexa Skills Kit, you can say hello"
         }
       },
       "shouldEndSession": ses
     },
     "sessionAttributes": {}
    };
    return result;
}

function fetchInventory() {
  return callApi(urls.square.inventory, "GET", {}, headers, (data) => {
    // do something with the data slow moving products


    // send report report via sms

    // more analysis => top three performing apps

    // run adds
    console.log(data)
  });
}

function sendTwilioMsg(to, body, res){
  twilio.sendMessage({
    to: to,// '+17184061667', // Any number Twilio can deliver to
    from: config.twilio.NUMBER, // A number you bought from Twilio and can use for outbound communication
    body: body, // body of the SMS message
    // body: "https://files.slack.com/files-pri/T2LU7A6F8-F2T0H1QKE/screen_shot_2016-10-23_at_1.14.25_am.png",
    // MediaUrl: "https://files.slack.com/files-pri/T2LU7A6F8-F2T0LUX7A/screen_shot_2016-10-23_at_1.08.55_am.png",

  }, (err, responseData) => { //this function is executed when a response is received from Twilio
      console.log('in here brahs:', err)
      if (!err) { // "err" is an error received during the request, if any
          console.log(responseData.from); // outputs "+14506667788"
          console.log(responseData.body); // outputs "word to your mother."
          res ? res.send(ree("We are doing well today. Sending you todays report through SMS. Do you want to know more about todays sales")) : console.log('map');
        
      } else {
        res.send(404)
      }
  });
}
function sendReport(res) {
  sendTwilioMsg('+17184061667', 'Daily Reports', res);
}

function runCampaign(res) {
  let payload = {
    name: "may campaign",
    objective: "LINK_CLICKS",
    status: "ACTIVE",
    access_token: config.facebook.access_token
  };

  // callApi('https://graph.facebook.com/v2.8/act_43933892/campaigns', 'POST', payload, null, (data) => {
  // // pull every loyal customer from Square API and send them LC specific campaign
  // });

  Promise.map(customerArray, (customer) => {
    sendTwilioMsg(customer.number, "thank you for being a loyal customer")
  })
  .then(() => {
    res.send('ok');
  })

}

module.exports = {
  callApi: callApi,
  sendReport: sendReport,
  runCampaign: runCampaign,
  ree: ree
}