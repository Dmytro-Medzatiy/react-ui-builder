#!/usr/bin/env node
var io = require('socket.io');
var api = require('./lib/api.js');

api.initServer({ dirname: __dirname, io: io });