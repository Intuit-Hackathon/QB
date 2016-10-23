'use strict';
let rp = require('request-promise');
let config = require('./config.js');
let urls = require('./urls.js');
let twilio = require('twilio')(config.twilio.ACCOUNT_SID, config.twilio.AUTH_TOKEN);

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

function fetchInventory() {
  return callApi(urls.square.inventory, "GET", {}, headers, (data) => {
    // do something with the data slow moving products


    // send report report via sms

    // more analysis => top three performing apps

    // run adds
    console.log(data)
  });
}

function sendReport(res) {
  twilio.sendMessage({
    to: '+18056371990',// '+17184061667', // Any number Twilio can deliver to
    from: config.twilio.NUMBER, // A number you bought from Twilio and can use for outbound communication
    body: 'Sales Report.', // body of the SMS message
    // body: "https://files.slack.com/files-pri/T2LU7A6F8-F2T0H1QKE/screen_shot_2016-10-23_at_1.14.25_am.png",
    // MediaUrl: "https://files.slack.com/files-pri/T2LU7A6F8-F2T0LUX7A/screen_shot_2016-10-23_at_1.08.55_am.png",

  }, (err, responseData) => { //this function is executed when a response is received from Twilio
      console.log('in here brahs:', err)
      if (!err) { // "err" is an error received during the request, if any
          console.log(responseData.from); // outputs "+14506667788"
          console.log(responseData.body); // outputs "word to your mother."
      }
      res.send({
        response: `I went ahead and sent your reports to your cell phone.`
      });
  });
}

function runCampaign(res) {
  let payload = {
    name: "may campaign",
    objective: "LINK_CLICKS",
    status: "ACTIVE",
    access_token: config.facebook.access_token
  };

  callApi('https://graph.facebook.com/v2.8/act_43933892/campaigns', 'POST', payload, null, (data) => {
    console.log(data);
    res.send('ok');
  });

  // pull every loyal customer from Square API and send them LC specific campaign
}

module.exports = {
  callApi: callApi,
  sendReport: sendReport,
  runCampaign: runCampaign
}