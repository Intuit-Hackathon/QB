'use strict';
let config = require('./config.js');
let scopes = ['ITEMS_READ', 'ITEMS_WRITE'];
const square_base_uri_v1 = "https://connect.squareup.com/v1"
const square_base_uri_v2 = "https://connect.squareup.com/v2"
const square_base_oauth_uri = 'https://connect.squareup.com/oauth2';

module.exports = {
  square_oauth: `${square_base_oauth_uri}/authorize?client_id=${config.square.client_id}&scope=${scopes.join(' ')}`,
  square_access: `${square_base_oauth_uri}/token`,
}