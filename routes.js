'use strict';

let rp = require('request-promise');
let utils = require('./utils.js');
let urls = require('./urls.js');
let config = require('./config.js');
let authorized = false;

let headers = {
  "Authorization": `Bearer ${config.square.access_token}`,
  "Accept": "application/json",
  "Content-Type": "application/json"
}

let routes = (server) => {
    server.get('/', (req, res) => {
      res.send('ok');
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