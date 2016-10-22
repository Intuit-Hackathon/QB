'use strict';

const nconf = require('nconf');
const path = require('path');

nconf
    .argv()
    .file({ file: __dirname + '/config.json' });

module.exports = nconf.get();
module.exports.nconf = nconf;