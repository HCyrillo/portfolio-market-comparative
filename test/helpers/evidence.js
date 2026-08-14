const allure = require('allure-js-commons');

async function logEvidence(testName, {
  step,
  method,
  url,
  query,
  body,
  response
}) {
  const evidence = {
    test: testName,
    step,
    request: {
      method: method ? String(method).toUpperCase() : undefined,
      url,
      query,
      body
    },
    response: {
      status: response?.status,
      statusText: response?.statusText,
      body: response?.body
    }
  };

  const serialized = JSON.stringify(evidence, null, 2);

  await allure.attachment(
    step ? `Evidence - ${step}` : 'API Evidence',
    serialized,
    'application/json'
  );
}

module.exports = {
  logEvidence
};