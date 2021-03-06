'use strict';
let rp = require('request-promise');
let config = require('./config.js');
let urls = require('./urls.js');
let twilio = require('twilio')(config.twilio.ACCOUNT_SID, config.twilio.AUTH_TOKEN);
let Promise = require('bluebird');
let date = new Date();

let customerArray = [{number: "+17184061667", name: "Abhinav"}, {fb_id: "57df392dc32ebce2b55ab608", name: "Abhinav"}];
let headers = {
  "Authorization": `Bearer ${config.square.access_token}`,
  "Accept": "application/json",
  "Content-Type": "application/json"
};

let headers_sand = {
  "Authorization": `Bearer ${config.square.test_access_token}`,
  "Accept": "application/json",
  "Content-Type": "application/json"
};

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

function submitTransaction(data) {
  let payload = {
    idempotency_key: `${date.getTime()}`,
    amount_money: {
      amount: 1000,
      currency: "USD"
    },
    card_nonce: data.nonce
  };
  callApi(urls.square.transaction, 'POST', payload, headers_sand, (data) => {
    console.log(data);
  });
}

function sendFBMsg(id){
  let payload = {
    recipient:{
      id:id
    },
    message:{
      text:"Hi Abhinav, Thanks for your order. We value loyal customers and we have added you 10pts to your loyalty.....",
      attachment: {
        "type":"template",
          "payload":{
            "template_type":"button",
            "text":"how did you feel about your last order?",
            "quick_replies":[
             {
               "content_type":"text",
               "title":"",
               "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN",
               "image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Face-smile.svg/240px-Face-smile.svg.png"
              },
              {
                "content_type":"text",
                "title":"",
                "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED",
                "image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Face-sad.svg/240px-Face-sad.svg.png"
              },
              {
                "content_type":"text",
                "title":"",
                "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_WHITE",
                "image_url":"https://upload.wikimedia.org/wikipedia/commons/0/0c/Emoticon_Face_Neutral_GE.png"
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
  sendTwilioMsg('+18056371990', 'Hey Abhinav, here are the reports that you requested.', imgUrlArray, res);
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
      // sendFBMsg(customer.fb_id)
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
  sendTwilioMsg: sendTwilioMsg,
  submitTransaction: submitTransaction
}