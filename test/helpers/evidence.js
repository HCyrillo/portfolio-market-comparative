function logEvidence(testName, { method, url, query, body, response }) {
  const evidence = {
    test: testName,
    request: {
      method: method ? String(method).toUpperCase() : undefined,
      url,
      query,
      body
    },
    response: {
      status: response?.status,
      body: response?.body
    }
  };

  const serialized = JSON.stringify(evidence, null, 2);

  if (global.allure && typeof global.allure.createAttachment === 'function') {
    global.allure.createAttachment(
      'API Evidence',
      serialized,
      'application/json'
    );
    return;
  }

  console.log(`\n[EVIDENCE] ${testName}\n${serialized}`);
}

module.exports = {
  logEvidence
};