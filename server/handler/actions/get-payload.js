/**
 * Attaches the JSON parsed payload to the state object.
 *
 * @param state
 * @return state
 */
module.exports = function getPayload(state) {
  var payload = state.argv[0];

  console.log(payload);
  state.payload = JSON.parse(payload);

  // Inject the `SECRETS` location into this environment.
  process.env.AWS_SES_SECRETS = state.payload.env.AWS_SES_SECRETS;

  return state;
};
