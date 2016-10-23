'use strict';

let express = require('express');
let server = express();     
let bodyParser = require('body-parser');
let utils = require('./utils.js');
let config = require('./config.js');
let date = new Date();
let routes = require('./routes.js');

// MIDDLEWARE
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

// HOMEPAGE MIDDLEWARE
server.use('/', express.static(__dirname + '/public'));

// ROUTES
routes(server);

server.listen(process.env.PORT || 3000, () => {
  console.log('Listening on Port: 3000');
})

module.exports = server;