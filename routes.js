'use strict';

let rp = require('request-promise');
let utils = require('./utils.js');
let urls = require('./urls.js');
let config = require('./config.js');
let json = require('json-update');
let authorized = false;

let routes = (server) => {
    server.get('/', (req, res) => {
      if(!authorized) {
        // res.writeHead(200, config.square.headers);
        console.log("url:" + urls.square_oauth)
        res.redirect(urls.square_oauth);
      } else {
        res.send('authorized');
      }
    });

    server.get('/oauth', (req, res) => {
      let code = req.query.code;

      if(code) {
        let payload = {
            client_id: config.square.client_id,
            client_secret: config.square.secret,
            code: code
        };
        utils.callApi(urls.square_access, "POST", payload, "square", (data) => {
          // console.log('config:' + config);
          authorized = true;

          // naive solution for updating config;
          config.square.access_token = data.access_token;
        })
      } else {
        console.log(req.body);
      }
    });

    server.post('', (req, res) => {});
}

module.exports = routes; 