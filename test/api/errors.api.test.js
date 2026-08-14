const request = require('supertest');
const { expect } = require('chai');
const { createApp } = require('../../src/app');
const { seedToDir, removeDataDirectory } = require('../helpers/fixtures');
const { logEvidence } = require('../helpers/evidence');

describe('HTTP error contract', () => {
  let directory;
  let api;

  beforeEach(async () => {
    directory = await seedToDir();
    api = request(createApp({ dataDirectory: directory }));
  });

  afterEach(async () => {
    await removeDataDirectory(directory);
  });

  it('mantém envelope padronizado para erros 400', async () => {
    const response = await api.post('/api/v1/products')
      .send({ category: 'Bebidas', available: true })
      .expect(400);

    expect(response.body).to.have.keys(['timestamp', 'status', 'error', 'message']);
    expect(response.body.status).to.equal(400);
    expect(response.body.error).to.equal('Bad Request');

    logEvidence('mantém envelope padronizado para erros 400', {
      method: 'POST',
      url: '/api/v1/products',
      body: { category: 'Bebidas', available: true },
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });

  it('mantém envelope padronizado para rota inexistente', async () => {
    const response = await api.get('/api/v1/inexistente').expect(404);

    expect(response.body).to.have.keys(['timestamp', 'status', 'error', 'message']);
    expect(response.body.status).to.equal(404);
    expect(response.body.error).to.equal('Not Found');

    logEvidence('mantém envelope padronizado para rota inexistente', {
      method: 'GET',
      url: '/api/v1/inexistente',
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });
});
