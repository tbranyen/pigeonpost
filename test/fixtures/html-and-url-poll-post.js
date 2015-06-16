const moment = require('moment');

module.exports = {
  id: 'test-uuid',
  to: ['tim@tabdeveloper.com'],
  from: 'tim@bocoup.com',
  template: {
    type: 'text',
    engine: 'combyne',
    value: 'Hello {{ name }}'
  },
  data: {
    type: 'url',
    parser: 'html',
    value: 'http://tbranyen.com/'
  },
  schedule: moment().add(1, 'seconds'),
  handler: function($) {
    return {
      name: $('title').text()
    };
  }.toString()
};
