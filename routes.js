'use strict';

let rp = require('request-promise');
let utils = require('./utils.js');
let urls = require('./urls.js');
let config = require('./config.js');
let authorized = false;
var alexa = require('./alexa')

var ree = function(input,sessionInfo) {
    if (sessionInfo==true) {
        var ses = true;
    }
    else {
        var ses = false;
    }
    var result = {
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

var usrSession = [];

let headers = {
  "Authorization": `Bearer ${config.square.access_token}`,
  "Accept": "application/json",
  "Content-Type": "application/json"
}

let routes = (server) => {
    server.get('/', (req, res) => {
      res.send('ok');
    });
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
                    res.send(ree("We are doing good today. Sending you the stats through message. Do you want to know more about todays sales"));
                    console.log(body.request.intent);
                    console.log("status");
                    break;
                case "ByeWorld":
                    res.send(ree("see you tomorrow",true));
                    console.log(body.request);
                    console.log("ByeWorld");
                    break;
                case "reports":
                    res.send(ree("Sales of oranges and apples are good. pears and bananas sales are poor. Do you want to run ad campains on slow moving products"));
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

        res.send('ok');
        console.log(data)
      })
    })

    server.post('/incoming/intent', (req, res) => {
      let data = req.body.body;
      switch (data.intent) {
        case "1":
        default:
          console.log(data.intent);
      }
    });

}

module.exports = routes;
