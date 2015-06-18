const express = require('express');
const configure = require('./configure');
const api = require('./api');
const email = require('./email');

var app = configure(express()).use(api);

// Expose bounce list.
app.bounceList = email.bounceList;

// Process sending failures.
email.handleUndeliverables();

// This processes the queue as necessary.
email.processQueue();

module.exports = app;
