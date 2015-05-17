const express = require('express');
const configure = require('./configure');
const api = require('./api');
const email = require('./email');

// This processes the queue as necessary.
email.processQueue();

var app = configure(express());
app.use(api);

module.exports = app;
