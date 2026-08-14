const request = require('supertest');
const { expect } = require('chai');
const { createApp } = require('../../src/app');
const { seedToDir, removeDataDirectory } = require('../helpers/fixtures');
const { logEvidence } = require('../helpers/evidence');

describe('Comparison critical flow E2E', () => {
  let directory;
  let api;

  beforeEach(async () => {
    directory = await seedToDir();
    api = request(createApp({ dataDirectory: directory }));
  });

  afterEach(async () => {
    await removeDataDirectory(directory);
  });

  const createProduct = async () => (await api.post('/api/v1/products')
    .send({ name: 'Arroz', category: 'Mercearia', available: true })
    .expect(201)).body.data;

  const createPrice = (marketId, productId, price) => api.post('/api/v1/prices')
    .send({ marketId, productId, price });

  it('[TS-E2E-001][RSK-001] executa produto → preços → comparação', async () => {
    const product = await createProduct();
    await createPrice(1, product.id, 8.9).expect(201);
    await createPrice(2, product.id, 9.5).expect(201);

    const response = await api.get('/api/v1/comparison')
      .query({ originMarketId: 1, targetMarketId: 2, productId: product.id })
      .expect(200);

    expect(response.body.data.bestPrice).to.deep.equal({
      marketId: 1,
      marketName: 'Mercado A',
      price: 8.9,
      saving: 0.6
    });
    expect(response.body.metadata.timestamp).to.match(/^\d{4}-\d{2}-\d{2}T/);

    logEvidence('[TS-E2E-001][RSK-001] executa produto → preços → comparação', {
      method: 'GET',
      url: '/api/v1/comparison',
      query: { originMarketId: 1, targetMarketId: 2, productId: product.id },
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });

  it('[TS-E2E-003][RSK-004][RSK-001] usa preço atualizado em nova comparação', async () => {
    const product = await createProduct();
    const firstPrice = (await createPrice(1, product.id, 8.9).expect(201)).body.data;
    await createPrice(2, product.id, 9.5).expect(201);

    await api.patch(`/api/v1/prices/${firstPrice.id}`)
      .send({ price: 10 })
      .expect(200);

    const response = await api.get('/api/v1/comparison')
      .query({ originMarketId: 1, targetMarketId: 2, productId: product.id })
      .expect(200);

    expect(response.body.data.bestPrice.marketId).to.equal(2);
    expect(response.body.data.bestPrice.saving).to.equal(0.5);

    logEvidence('[TS-E2E-003][RSK-004][RSK-001] usa preço atualizado em nova comparação', {
      method: 'GET',
      url: '/api/v1/comparison',
      query: { originMarketId: 1, targetMarketId: 2, productId: product.id },
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });

  it('[TS-E2E-002][RSK-005] impede comparação após desativar o produto', async () => {
    const product = await createProduct();
    await createPrice(1, product.id, 8.9).expect(201);
    await createPrice(2, product.id, 9.5).expect(201);
    await api.patch(`/api/v1/products/${product.id}/availability`)
      .send({ available: false })
      .expect(200);

    const response = await api.get('/api/v1/comparison')
      .query({ originMarketId: 1, targetMarketId: 2, productId: product.id })
      .expect(400);

    expect(response.body.message).to.match(/indisponível/);

    logEvidence('[TS-E2E-002][RSK-005] impede comparação após desativar o produto', {
      method: 'GET',
      url: '/api/v1/comparison',
      query: { originMarketId: 1, targetMarketId: 2, productId: product.id },
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });

  it('[TS-E2E-004][RSK-002] impede comparação quando somente um mercado possui preço', async () => {
    const product = await createProduct();
    await createPrice(1, product.id, 8.9).expect(201);

    const response = await api.get('/api/v1/comparison')
      .query({ originMarketId: 1, targetMarketId: 2, productId: product.id })
      .expect(422);

    expect(response.body.message).to.match(/Mercado B não possui preço/);

    logEvidence('[TS-E2E-004][RSK-002] impede comparação quando somente um mercado possui preço', {
      method: 'GET',
      url: '/api/v1/comparison',
      query: { originMarketId: 1, targetMarketId: 2, productId: product.id },
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });
});
