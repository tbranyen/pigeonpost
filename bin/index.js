const app = require('../server');

var port = process.env.PORT || 8000;
var host = process.env.HOST || '0.0.0.0';

if (!process.env.AWS_SES_SECRETS) {
  console.warn('>> Missing AWS_SES_SECRETS environment variable\n');
}

app.listen(port, host, function() {
  console.log('http://localhost:' + this.address().port);
});
