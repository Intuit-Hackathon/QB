'use strict';
let rp = require('request-promise');
let config = require('./config.js');
let urls = require('./urls.js');
let twilio = require('twilio')(config.twilio.ACCOUNT_SID, config.twilio.AUTH_TOKEN);
let Promise = require('bluebird');
let date = new Date();

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
          res ? res.send(ree("We are doing good. Sending you todays report via text. This might take a few seconds, in the mean while do you want further details on todays sales trends?")) : null;
        
      } else {
        res ? res.send(404) : null;
      }
  });
}

function sendFBMsg(){
  let payload = {
    recipient:{
      id:"10154944007950644"
    },
    message:{
      text:"Thanks for completing your order. We added 10 point to your loyalty!",
      attachment: {
        "type":"template",
          "payload":{
            "template_type":"button",
            "text":"Tell?",
            "buttons":[
              {
                "type":"web_url",
                "url":"https://petersapparel.parseapp.com",
                "title":"Show Website"
              },
              {
                "type":"postback",
                "title":"Start Chatting",
                "payload":"USER_DEFINED_PAYLOAD"
              }
            ]
          }
      }
    }
  };
  callApi(config.facebook.post_msg_url, 'POST', payload, null, (result) => {
    console.log(result);
  })
}

function sendReport(res) {
  let imgUrlArray = ['https://s3-us-west-1.amazonaws.com/seatjoy.io/images/screen_shot_2016-10-23_at_7.45.17_am_1024.png',
  'https://s3-us-west-1.amazonaws.com/seatjoy.io/images/screen_shot_2016-10-23_at_7.41.46_am_1024.png'
  ];
  sendTwilioMsg('+17184061667', 'Hey Abhinav, here are the reports that you requested.', imgUrlArray, res);
}

function runCampaign(res) {
  let payload = {
    name: `[${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours() + 1}:${date.getMinutes()}] Soma Cafe campaign`,
    objective: "LINK_CLICKS",
    status: "ACTIVE",
    access_token: config.facebook.access_token
  };

  callApi('https://graph.facebook.com/v2.8/act_43933892/campaigns', 'POST', payload, null, (data) => {
    console.log('Facebook campaign ran successfully');
  });

  // pull every loyal customer from Square API and send them LC specific campaign
  Promise.map(customerArray, (customer) => {
    let msg;
    console.log(customer)
    if(customer.number) {
      let imgUrlArray = ["http://somaeatssf.com/wp-content/uploads/2015/01/SOMAEats_005.jpg"];
      msg = `Hey ${customer.name}, thanks for being a loyal customer. Today you get 30% off on your orders of Greek Salad, Steel Cut Oaks and Spiced Burrito`
      sendTwilioMsg(customer.number, msg, imgUrlArray);
      console.log('running campaign')

    } else if(customer.fb_id){
      msg = ``
      // sendFBMsg()
    }
  })
  .then(() => {
    console.log('campaign ran')
    res.send(ree('Your campaign ran successfully!'));
  })
  .catch((err) => {
    console.log(err);
  })

}

module.exports = {
  callApi: callApi,
  sendReport: sendReport,
  runCampaign: runCampaign,
  ree: ree,
  sendTwilioMsg: sendTwilioMsg
}