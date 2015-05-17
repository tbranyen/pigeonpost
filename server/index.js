const express = require('express');
const Bluebird = require('bluebird');
const configure = require('./configure');
const api = require('./api');
const email = require('./email');

// This processes the queue as necessary.
email.processQueue();

// Export the API as middleware.
module.exports = configure(express());
