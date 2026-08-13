const request = require('supertest');
const { expect } = require('chai');
const { createApp } = require('../../src/app');
const { seedToDir, removeDataDirectory } = require('../helpers/fixtures');

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
    await api.get('/api/v1/health').expect(200, /UP/);
  });

  it('[TS-MKT-001] lista mercados cadastrados', async () => {
    const response = await api.get('/api/v1/markets').expect(200);

    expect(response.body.data).to.have.lengthOf(2);
    expect(response.body.data.map(({ name }) => name)).to.deep.equal(['Mercado A', 'Mercado B']);
  });
});
