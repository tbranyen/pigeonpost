module.exports = function(app) {
  var env = process.env;

  if (env.NODE_ENV === 'production') {
    env.PORT = './socket';
  }

  return app;
};
