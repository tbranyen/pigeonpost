const express = require('express');
const bodyParser = require('body-parser');
const email = require('../../email');

var router = express.Router();

router.post('/', [bodyParser.json()], function(req, res) {
  var validPayload = true;
  var payload = req.body;

  // Ensure the payload contains valid required arguments.
  if (!payload.to || !payload.from || !payload.subject || !payload.body) {
    validPayload = false;
  }

  if (!validPayload) {
    return res.status(400).json({
      message: 'Invalid POST body'
    });
  }

  email.send(email.normalizePayload(payload), function(err, resp) {
    if (err) {
      return res.status(500).json({
        error: err
      });
    }

    res.json({ data: resp });
  });
});

module.exports = router;
