'use strict';
let rp = require('request-promise');
let config = require('./config.js');
let urls = require('./urls.js');
let twilio = require('twilio')(config.twilio.ACCOUNT_SID, config.twilio.AUTH_TOKEN);
let Promise = require('bluebird');

let customerArray = [{number: "+17184061667", name: "Abhinav"}, {fb_id: "+17184061667", name: "Abhinav"}];

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
    let ses;
    if (sessionInfo==true) {
        ses = true;
    }
    else {
        ses = false;
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

function sendTwilioMsg(to, msg, imgUrlArray, res){
  twilio.sendMessage({
    to: to,// '+17184061667', // Any number Twilio can deliver to
    from: config.twilio.NUMBER, // A number you bought from Twilio and can use for outbound communication
    body: msg, // body of the SMS message
    mediaUrl: imgUrlArray
  }, (err, responseData) => { //this function is executed when a response is received from Twilio
      console.log('in here brahs:', err)
      if (!err) { // "err" is an error received during the request, if any
          console.log(responseData.from); // outputs "+14506667788"
          console.log(responseData.body); // outputs "word to your mother."
          res ? res.send(ree("We are doing well today. Sending you todays report through SMS. Do you want to know more about todays sales")) : null;
        
      } else {
        res ? res.send(404) : null;
      }
  });
}
function sendReport(res) {
  let imgUrlArray = ['https://s3-us-west-1.amazonaws.com/seatjoy.io/images/screen_shot_2016-10-23_at_7.45.17_am_1024.png',
  'https://s3-us-west-1.amazonaws.com/seatjoy.io/images/screen_shot_2016-10-23_at_7.41.46_am_1024.png'
  ];
  sendTwilioMsg('+18056371990', 'Hey Abhinav, here are the reports that you requested.', imgUrlArray, res);
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
    if(customer.number) {
      let msg = `Hey ${customer.name}, thanks for being a loyal customer. Today you get 30% off on your orders of Greek Salad, Steel Cut Oaks and Spiced Burrito`
      let imgUrlArray = ["http://somaeatssf.com/wp-content/uploads/2015/01/SOMAEats_005.jpg"];
      sendTwilioMsg(customer.number, msg, imgUrlArray)
    } else if(customer.fb_id){

    }

  })
  .then(() => {
    res.send('ok');
  })

}

module.exports = {
  callApi: callApi,
  sendReport: sendReport,
  runCampaign: runCampaign,
  ree: ree,
  sendTwilioMsg: sendTwilioMsg
}