'use strict';

let fs = require('fs');
let rp = require('request-promise');
let utils = require('./utils.js');
let urls = require('./urls.js');
let config = require('./config.js');
let authorized = false;
let usrSession = [];

let headers = {
  "Authorization": `Bearer ${config.square.access_token}`,
  "Accept": "application/json",
  "Content-Type": "application/json"
}

let routes = (server) => {
    server.post('/alexa',function (req,res) {
        console.log("executing");
        let body = req.body;
        if (body.request.type =="LaunchRequest") {
            console.log("----------");
            res.send(utils.ree("Welcome to SeedJoy. I hope you are doing well"));
        }
        else if (typeof body.request.intent != 'undefined'){
            switch (body.request.intent.name) {
                 case "status":
                    utils.sendReport(res)
                    console.log(body.request.intent);
                    console.log("status");
                    break;
                case "ByeWorld":
                    res.send(utils.ree("see you tomorrow",true));
                    console.log(body.request);
                    console.log("ByeWorld");
                    break;
                case "reports":
                    res.send(utils.ree("Today the Smoked Salmon, and Cranberry Salad were your top sellers. While the Greek Salad, and Spiced Burrito under performed. Do you want to run ad campaigns on slow moving products?"));
                    console.log(body.request);
                    console.log("reports");
                    break;
                case "adcampaigns":
                    utils.runCampaign(res);
                    console.log(body.request);
                    console.log("reports");
                    break;
                case "thankyou":
                    res.send(utils.ree("Dont mention it."));
                    console.log(body.request);
                    console.log("thankyou");
                    break;
                case "finalStatus":
                    res.send(utils.ree("Pretty Good. We converted 20 percent of customers through ad campaigns and by the way i updated them in square and quickbooks"));
                    console.log(body.request);
                    console.log("reports");
                    break;
                case "AMAZON.HelpIntent":
                    res.send(utils.ree("sorry about that"));
                    console.log(body.request);
                    console.log("AMAZON.HelpIntent");
                    break;
                case "AMAZON.StopIntent":
                    res.send(utils.ree("goodbye",true));
                    console.log(body.request);
                    console.log("AMAZON.StopIntent");
                    break;
                default:
                    console.log(body.request);
                    res.send(utils.ree("i dont know what you're saying"));
            }
        }
        else {
                console.log(body.request);
                res.send(utils.ree("Welcome to SeedJoy. I hope you are good"));
        }

    });

    // server.get('/oauth', (req, res) => {
    //   let code = req.query.code;

    //   if(code) {
    //     let payload = {
    //         client_id: config.square.client_id,
    //         client_secret: config.square.secret,
    //         code: code
    //     };
    //     utils.callApi(urls.square.access, "POST", payload, headers, (data) => {
    //       // console.log('config:' + config);
    //       authorized = true;

    //       // naive solution for updating config;
    //       config.square.access_token = data.access_token;
    //       headers.Authorization = `Bearer ${data.access_token}`;
    //       res.redirect('/')

    //     })
    //   } else {
    //     console.log(req.body);
    //   }
    // });

    server.post('/confirm/payment', (req, res) => {
      // used by FB endpoint
      let data = req.body;
      console.log(data);
      utils.submitTransaction(data);
      res.send('ok');

    });

    server.get('/fb', (req, res) => {
      utils.submitTransaction()
      res.send('ok');
    })
}

module.exports = routes;
