const assert = require('assert');
const path = require('path');
const express = require('express');
const supertest = require('supertest');
const _ = require('lodash');
const crontab = require('../mocks/crontab');
const typicalPollPost = require('../fixtures/typical-poll-post');
const htmlAndUrlPollPost = require('../fixtures/html-and-url-poll-post');

var handlerPath = 'node ' + path.join(__dirname, '../../bin/handler');
var server = express();

describe('API', function() {
  describe('Poll', function() {
    before(function() {
      this.router = require('../../server/api/poll/router');
      server.use('/poll', this.router);
      this.request = supertest(server);
      this.typicalPollPost = _.extend({}, typicalPollPost);
      this.htmlAndUrlPollPost = _.extend({}, htmlAndUrlPollPost);
    });

    it('can GET all poller jobs', function(done) {
      this.request
        .get('/poll')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          done(err);
        });
    });

    it('can GET a specific poller job', function(done) {
      this.request
        .get('/poll/test-uuid')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          done(err);
        });
    });

    it('can POST to register poller', function(done) {
      var test = this;

      this.request
        .post('/poll')
        .send(test.typicalPollPost)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          var handlerAsBase64 = new Buffer(test.typicalPollPost.handler)
            .toString('base64');

          test.typicalPollPost.handler = handlerAsBase64;
          test.typicalPollPost.env = {
            AWS_SES_SECRETS: process.env.AWS_SES_SECRETS
          };

          var serialized = '\'' + JSON.stringify(test.typicalPollPost) + '\'';
          assert.equal(crontab.result._command, handlerPath + ' ' + serialized);
          done(err);
        });
    });

    // TODO Put example.

    it('can schedule with html data and url fetched data', function(done) {
      var test = this;

      this.request
        .post('/poll')
        .send(htmlAndUrlPollPost)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          var handlerAsBase64 = new Buffer(test.htmlAndUrlPollPost.handler)
            .toString('base64');

          test.htmlAndUrlPollPost.handler = handlerAsBase64;
          test.htmlAndUrlPollPost.env = {
            AWS_SES_SECRETS: process.env.AWS_SES_SECRETS
          };
          test.htmlAndUrlPollPost.expires = true;

          var serialized = '\'' + JSON.stringify(test.htmlAndUrlPollPost) + '\'';

          assert.equal(crontab.result._command, handlerPath + ' ' + serialized);

          // Test out the handler.
          setTimeout(function() {
            assert.equal(crontab.result._state.payload.body, 'Hello Tim');
            done(err);
          }, 1500);
        });
    });

    it('can DELETE a specific poller job', function() {
      this.request
        .post('/poll')
        .send(htmlAndUrlPollPost);

      this.request
        .delete('/poll/test-uuid')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          done(err);
        });
    });
  });

  describe('Sending', function() {
    before(function() {
      this.router = require('../../server/api/send/router');
      server.use('/send', this.router);
      this.request = supertest(server);
    });

    it('can POST an e-mail immediately', function(done) {
      this.request
        .post('/send')
        .send({
          from: 'test@bocoup.com',
          to: ['someone@email.com'],
          subject: 'Testing',
          body: '<strong>Testing HTML</strong>'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          done(err);
        });
    });

    it('will reject missing required fields', function(done) {
      this.request
        .post('/send')
        .send({
          to: ''
        })
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('will reject invalid POST', function(done) {
      this.request
        .post('/send')
        .send('{ )')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });
  });
});
