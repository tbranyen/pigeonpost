const app = require('../server');

var port = process.env.PORT || 8000;
var host = process.env.HOST || '0.0.0.0';

app.listen(port, host, function() {
  console.log('http://localhost:' + this.address().port);
});
