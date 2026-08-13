const request = require('supertest');
const { expect } = require('chai');
const { createApp } = require('../../src/app');
const { seedToDir, removeDataDirectory } = require('../helpers/fixtures');

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
  });

  it('mantém envelope padronizado para rota inexistente', async () => {
    const response = await api.get('/api/v1/inexistente').expect(404);

    expect(response.body).to.have.keys(['timestamp', 'status', 'error', 'message']);
    expect(response.body.status).to.equal(404);
    expect(response.body.error).to.equal('Not Found');
  });
});
