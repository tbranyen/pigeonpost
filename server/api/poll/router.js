const assert = require('assert');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const crontab = require('crontab');
const uuid = require('node-uuid');
const Bluebird = require('bluebird');

var handlerPath = 'node ' + path.join(__dirname, '../../../bin/handler');
var router = express.Router();

router.use(bodyParser.json());

function createJob(crontab, body) {
  var schedule = body.schedule;

  // Save the secrets location.
  body.env = { AWS_SES_SECRETS: process.env.AWS_SES_SECRETS };

  if (typeof schedule === 'number') {
    schedule = new Date(schedule);

    // Setting a date directly will cause it to be a one time only event.
    body.expires = true;
  }

  // Convert body.handler to base64 to avoid quoting issues on CLI.
  if (body.handler) {
    body.handler = new Buffer(body.handler).toString('base64');
  }

  return crontab.create([
    handlerPath,
    '\'' + JSON.stringify(body) + '\''
  ].join(' '), schedule, body.id || uuid());
}

function formatJob(job) {
  return job ? { id: job.comment() } : null;
}

function sendResponse(res, job) {
  res.json({ data: formatJob(job) });
}

function sendError(res, ex) {
  res.status(500).json({ error: ex });
}

function validateBody(body) {
  assert(body, 'Body payload is defined');
  assert(body.template, 'Template is missing');
  assert(body.data, 'Data is missing');
  assert(body.schedule, 'Schedule is missing');
}

var getCronTab = new Bluebird(function(resolve, reject) {
  crontab.load(function(err, crontab) {
    if (err) { reject(err); }
    else { resolve(crontab); }
  });
}).catch(function(ex) {
  console.error(ex);
  process.exit(1);
});

router.get('/', function(req, res) {
  getCronTab.then(function(crontab) {
    res.json({ data: crontab.find().map(formatJob) });
  }).catch(sendError.bind(null, res));
});

router.get('/:id', function(req, res) {
  getCronTab.then(function(crontab) {
    var job = crontab.find({ comment: req.params.id });
    sendResponse(res, job);
  }).catch(sendError.bind(null, res));
});

router.post('/', function(req, res) {
  getCronTab.then(function(crontab) {
    validateBody(req.body);

    var id = req.body.id || uuid();
    var prior = crontab.find({ comment: id });

    assert(!prior || !prior.length, 'This job already exists');

    var job = createJob(crontab, req.body);

    crontab.save(function() {
      sendResponse(res, job);
    });
  }).catch(function(ex) {
    console.error(ex.stack);
    sendError(res);
  });
});

router.put('/', function(req, res) {
  getCronTab.then(function(crontab) {
    var prior = crontab.find({ comment: req.body.id });

    if (prior) {
      var job = crontab.find({ comment: req.body.id });
      return sendResponse(res, job);
    }

    var job = createJob(crontab, req.body);

    crontab.save(function() {
      sendResponse(res, job);
    });
  }).catch(sendError.bind(null, res));
});

router.delete('/:id', function(req, res) {
  getCronTab.then(function(crontab) {
    var prior = crontab.find({ comment: req.params.id });

    assert(prior, 'Job doesn\'t exist');

    var job = crontab.remove({ comment: req.params.id });

    crontab.save(function() {
      sendResponse(res, { comment: function() { return req.params.id; } });
    });
  }).catch(sendError.bind(null, res));
});

module.exports = router;
