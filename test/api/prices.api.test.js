const request = require('supertest');
const { expect } = require('chai');
const { createApp } = require('../../src/app');
const { seedToDir, removeDataDirectory } = require('../helpers/fixtures');

describe('Prices API', () => {
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

  it('[TS-PRC-001][RSK-003] cadastra preço válido', async () => {
    const product = await createProduct();

    const response = await api.post('/api/v1/prices')
      .send({ marketId: 1, productId: product.id, price: 8.9 })
      .expect(201);

    expect(response.body.data.price).to.equal(8.9);
  });

  it('[TS-PRC-009][RSK-003] rejeita preço enviado como string', async () => {
    await api.post('/api/v1/prices')
      .send({ marketId: 1, productId: 1, price: '8.90' })
      .expect(400);
  });

  it('[TS-PRC-006][RSK-006] rejeita preço para produto inexistente', async () => {
    const response = await api.post('/api/v1/prices')
      .send({ marketId: 1, productId: 999, price: 8.9 })
      .expect(404);

    expect(response.body.message).to.equal('Produto não encontrado.');
  });

  it('[TS-PRC-007][RSK-006] rejeita preço para mercado inexistente', async () => {
    const product = await createProduct();

    const response = await api.post('/api/v1/prices')
      .send({ marketId: 999, productId: product.id, price: 8.9 })
      .expect(404);

    expect(response.body.message).to.equal('Mercado não encontrado.');
  });

  it('[RSK-004] rejeita preço duplicado para o mesmo mercado e produto', async () => {
    const product = await createProduct();

    await api.post('/api/v1/prices')
      .send({ marketId: 1, productId: product.id, price: 8.9 })
      .expect(201);

    await api.post('/api/v1/prices')
      .send({ marketId: 1, productId: product.id, price: 9.5 })
      .expect(409);
  });

  it('rejeita filtro marketId inválido', async () => {
    await api.get('/api/v1/prices')
      .query({ marketId: 'inválido' })
      .expect(400);
  });
});
