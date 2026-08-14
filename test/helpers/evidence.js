function logEvidence(testName, { method, url, query, body, response }) {
  const evidence = {
    test: testName,
    request: {
      method: method && String(method).toUpperCase(),
      url,
      query,
      body
    },
    response: {
      status: response && response.status,
      statusText: response && response.statusText,
      headers: response && response.headers,
      body: response && response.body
    }
  };

  const serialized = JSON.stringify(evidence, null, 2);

  if (global.allure && typeof global.allure.createAttachment === 'function') {
    global.allure.createAttachment(testName, serialized, 'application/json');
    return;
  }

  console.log(`\n[EVIDENCE] ${testName}\n${serialized}`);
}

module.exports = {
  logEvidence
};
