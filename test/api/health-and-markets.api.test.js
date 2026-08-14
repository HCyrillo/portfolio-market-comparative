const request = require('supertest');
const { expect } = require('chai');
const { createApp } = require('../../src/app');
const { seedToDir, removeDataDirectory } = require('../helpers/fixtures');
const { logEvidence } = require('../helpers/evidence');

describe('Health and Markets API', () => {
  let directory;
  let api;

  beforeEach(async () => {
    directory = await seedToDir();
    api = request(createApp({ dataDirectory: directory }));
  });

  afterEach(async () => {
    await removeDataDirectory(directory);
  });

  it('[TS-HEALTH-001] informa aplicação disponível', async () => {
    const response = await api.get('/api/v1/health').expect(200, /UP/);

    logEvidence('[TS-HEALTH-001] informa aplicação disponível', {
      method: 'GET',
      url: '/api/v1/health',
      response: response.body ? { status: response.status, statusText: response.statusText, body: response.body } : response
    });
  });

  it('[TS-MKT-001] lista mercados cadastrados', async () => {
    const response = await api.get('/api/v1/markets').expect(200);

    expect(response.body.data).to.have.lengthOf(2);
    expect(response.body.data.map(({ name }) => name)).to.deep.equal(['Mercado A', 'Mercado B']);

    logEvidence('[TS-MKT-001] lista mercados cadastrados', {
      method: 'GET',
      url: '/api/v1/markets',
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });
});
