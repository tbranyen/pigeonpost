const engines = require('../../engines');

/**
 * Renders and saves a template with data using the designated engine.
 *
 * @param state
 * @return state
 */
module.exports = function renderTemplate(state) {
  var engine = engines[state.payload.template.engine];

  state.payload.body = engine.render(state.template, state.payload);

  return state;
};
