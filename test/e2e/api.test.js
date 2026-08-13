const request = require('supertest');
const { expect } = require('chai');
const { createApp } = require('../../src/app');
const { seedToDir, removeDataDirectory } = require('../helpers/fixtures');

describe('API E2E', () => {
  let directory;
  let api;

  beforeEach(async () => {
    directory = await seedToDir();
    api = request(createApp({ dataDirectory: directory }));
  });

  afterEach(() => removeDataDirectory(directory));

  const createProduct = async (available = true) => (await api.post('/api/v1/products').send({ name: 'Arroz', category: 'Mercearia', available }).expect(201)).body.data;
  const createPrice = (marketId, productId, price) => api.post('/api/v1/prices').send({ marketId, productId, price });

  it('executa produto → preços → comparação', async () => {
    const product = await createProduct();
    await createPrice(1, product.id, 8.9).expect(201);
    await createPrice(2, product.id, 9.5).expect(201);
    const response = await api.get('/api/v1/comparison').query({ originMarketId: 1, targetMarketId: 2, productId: product.id }).expect(200);
    expect(response.body.data.bestPrice).to.deep.equal({ marketId: 1, marketName: 'Mercado A', price: 8.9, saving: 0.6 });
    expect(response.body.metadata.timestamp).to.match(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('reflete atualização de preço na comparação', async () => {
    const product = await createProduct();
    const firstPrice = (await createPrice(1, product.id, 8.9).expect(201)).body.data;
    await createPrice(2, product.id, 9.5).expect(201);
    await api.patch(`/api/v1/prices/${firstPrice.id}`).send({ price: 10 }).expect(200);
    const response = await api.get('/api/v1/comparison').query({ originMarketId: 1, targetMarketId: 2, productId: product.id }).expect(200);
    expect(response.body.data.bestPrice.marketId).to.equal(2);
    expect(response.body.data.bestPrice.saving).to.equal(0.5);
  });

  it('recusa comparação com produto indisponível ou preço ausente', async () => {
    const product = await createProduct(false);
    await api.get('/api/v1/comparison').query({ originMarketId: 1, targetMarketId: 2, productId: product.id }).expect(400);
    await api.patch(`/api/v1/products/${product.id}/availability`).send({ available: true }).expect(200);
    await createPrice(1, product.id, 8.9).expect(201);
    const response = await api.get('/api/v1/comparison').query({ originMarketId: 1, targetMarketId: 2, productId: product.id }).expect(422);
    expect(response.body.message).to.match(/não possui preço/);
  });

  it('valida entradas, campos extras, duplicidade e JSON inválido', async () => {
    await api.post('/api/v1/products').send({ name: '', category: 'X', available: true }).expect(400);
    await api.post('/api/v1/products').send({ name: 'X', category: 'X', available: true, extra: true }).expect(400);
    await api.post('/api/v1/prices').send({ marketId: 1, productId: 1, price: '8.90' }).expect(400);
    await api.post('/api/v1/products').set('Content-Type', 'application/json').send('{').expect(400);
    const product = await createProduct();
    await createPrice(1, product.id, 8.9).expect(201);
    await createPrice(1, product.id, 9.5).expect(409);
  });

  it('expõe health, mercados, filtros e 404 padronizado', async () => {
    await api.get('/api/v1/health').expect(200, /UP/);
    const markets = await api.get('/api/v1/markets').expect(200);
    expect(markets.body.data.length).to.equal(2);
    await api.get('/api/v1/prices').query({ marketId: 'inválido' }).expect(400);
    const missing = await api.get('/api/v1/inexistente').expect(404);
    expect(missing.body.error).to.equal('Not Found');
  });
});
