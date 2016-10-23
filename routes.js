'use strict';

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
            res.send(ree("Welcome to SeedJoy. I hope you are good"));
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
                    res.send(utils.ree("Today the Smoked Salmon, Soupe de Jour, and Croque Madame were your top performing items. While the Greek Salad, Steel Cut Oaks and Spiced Burrito under performed. Do you want to run ad campaigns on slow moving products"));
                    console.log(body.request);
                    console.log("reports");
                    break;
                case "adcampaigns":
                    utils.runCampaign(res);
                    console.log(body.request);
                    console.log("reports");
                    break;
                case "finalStatus":
                    res.send(ree("todays sales are 28000 dollars. We converted 20 percent of customers through ad campaingns"));
                    console.log(body.request);
                    console.log("reports");
                    break;
                case "AMAZON.HelpIntent":
                    res.send(ree("sorry about that"));
                    console.log(body.request);
                    console.log("AMAZON.HelpIntent");
                    break;
                case "AMAZON.StopIntent":
                    res.send(ree("goodbye",true));
                    console.log(body.request);
                    console.log("AMAZON.StopIntent");
                    break;
                default:
                    console.log(body.request);
                    res.send(ree("i dont know what you're saying"));
            }
        }
        else {
                console.log(body.request);
                res.send(ree("Welcome to SeedJoy. I hope you are good"));
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

    server.get('/retrieve/inventory', (req, res) => {
      utils.callApi(urls.square.inventory, "GET", {}, headers, (data) => {
        // do something with the data slow moving products

        res.send({

        });

        // send report report via sms

        // more analysis => top three performing apps

        // run adds
        console.log(data)
      })
    })

    server.post('/confirmed/payment', (req, res) => {
      // used by FB endpoint
    });

}

module.exports = routes;
