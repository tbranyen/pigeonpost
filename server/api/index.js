const express = require('express');
const poll = require('./poll');
const send = require('./send');

var api = express.Router();

// Attach API components.
api.use('/poll', poll.router);
api.use('/send', send.router);
//api.use('/jobs', jobs.router); // TODO

module.exports = api;
