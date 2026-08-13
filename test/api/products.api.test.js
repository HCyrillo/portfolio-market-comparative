const request = require('supertest');
const { expect } = require('chai');
const { createApp } = require('../../src/app');
const { seedToDir, removeDataDirectory } = require('../helpers/fixtures');

describe('Products API', () => {
  let directory;
  let api;

  beforeEach(async () => {
    directory = await seedToDir();
    api = request(createApp({ dataDirectory: directory }));
  });

  afterEach(async () => {
    await removeDataDirectory(directory);
  });

  it('[TS-PRD-001] cadastra produto válido', async () => {
    const response = await api.post('/api/v1/products')
      .send({ name: 'Arroz', category: 'Mercearia', available: true })
      .expect(201);

    expect(response.body.data).to.include({ name: 'Arroz', category: 'Mercearia', available: true });
    expect(response.body.data.id).to.be.a('number');
  });

  it('[TS-PRD-002] rejeita produto sem nome', async () => {
    const response = await api.post('/api/v1/products')
      .send({ category: 'Bebidas', available: true })
      .expect(400);

    expect(response.body).to.have.keys(['timestamp', 'status', 'error', 'message']);
    expect(response.body.message).to.equal('Nome é obrigatório.');
  });

  it('[EXP-001] rejeita campos adicionais não permitidos', async () => {
    const response = await api.post('/api/v1/products')
      .send({ name: 'X', category: 'Y', available: true, extra: 'no' })
      .expect(400);

    expect(response.body.message).to.equal('Body contém campos não permitidos.');
  });

  it('[EXP-001] rejeita JSON inválido', async () => {
    const response = await api.post('/api/v1/products')
      .set('Content-Type', 'application/json')
      .send('{"name":')
      .expect(400);

    expect(response.body.message).to.equal('JSON inválido.');
  });
});
