const request = require('supertest');
const { expect } = require('chai');
const { createApp } = require('../../src/app');
const { makeProduct, makePrice, seedToDir, removeDataDirectory } = require('../helpers/fixtures');

describe('Comparison API', () => {
  let directory;

  afterEach(async () => {
    if (directory) await removeDataDirectory(directory);
    directory = undefined;
  });

  it('[TS-CMP-009] rejeita comparação entre o mesmo mercado', async () => {
    directory = await seedToDir({ products: [makeProduct(1)] });
    const api = request(createApp({ dataDirectory: directory }));

    const response = await api.get('/api/v1/comparison')
      .query({ originMarketId: 1, targetMarketId: 1, productId: 1 })
      .expect(400);

    expect(response.body.message).to.match(/origem e destino/);
  });

  it('[TS-CMP-007][RSK-002] retorna 422 quando um mercado não possui preço', async () => {
    directory = await seedToDir({
      products: [makeProduct(1, 'Café', true)],
      prices: [makePrice(1, 1, 1, 1000)]
    });
    const api = request(createApp({ dataDirectory: directory }));

    const response = await api.get('/api/v1/comparison')
      .query({ originMarketId: 1, targetMarketId: 2, productId: 1 })
      .expect(422);

    expect(response.body.error).to.equal('Unprocessable Entity');
    expect(response.body.message).to.match(/não possui preço/);
  });
});
