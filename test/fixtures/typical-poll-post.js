module.exports = {
  template: {
    engine: 'handlebars',
    type: 'string',
    value: 'On {{requestDay}}, {{requestor}} submitted a time off ' +
      'request for {{firstDay}} to {{lastDay}}.  Please respond to ' +
      'this request!'
  },

  data: {
    type: 'url',
    value: '/leave-requests/pending-review',
    parser: 'jsonapi'
  },

  schedule: '@daily',

  handler: function(resp) {
    return resp.map(function(entry) {
      return {
        data: {
          requestor: entry.employee.first + ' ' + entry.employee.last,
          requestDay: entry.request_day,
          firstDay: entry.first_day,
          lastDay: entry.last_day
        },

        to: entry.employee.supporter.email,
        from: entry.employee.email,
        cc: 'hr@bocoup.com',
        subject: 'Upcoming Time off Request (' + entry.first_day +
          ' - ' + entry.last_day + ')'
      };
    });
  }.toString()
};
