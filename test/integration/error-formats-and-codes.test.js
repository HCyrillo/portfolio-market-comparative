const request = require('supertest');
const { createApp } = require('../../src/app');
const { seedToDir, removeDataDirectory } = require('../helpers/fixtures');
// path not required in these tests

describe('API error formats and HTTP codes (integration)', () => {
  let app;
  let dataDir;

  afterEach(async () => {
    if (dataDir) await removeDataDirectory(dataDir);
  });

  it('POST /api/v1/products missing name returns 400 with error envelope', async () => {
    dataDir = await seedToDir();
    app = createApp({ dataDirectory: dataDir });

    const res = await request(app).post('/api/v1/products').send({ category: 'Bebidas', available: true }).set('Accept', 'application/json');
    expect(res.status).to.equal(400);
    expect(res.body).to.have.keys(['timestamp', 'status', 'error', 'message']);
    expect(res.body.error).to.equal('Bad Request');
    expect(res.body.message).to.equal('Nome é obrigatório.');
  });

  it('POST /api/v1/products with extra field returns 400 and message about not allowed fields', async () => {
    dataDir = await seedToDir();
    app = createApp({ dataDirectory: dataDir });

    const payload = { name: 'X', category: 'Y', available: true, extra: 'no' };
    const res = await request(app).post('/api/v1/products').send(payload).set('Accept', 'application/json');
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Body contém campos não permitidos.');
  });

  it('GET /api/v1/comparison with same origin and target returns 400 and domain message', async () => {
    app = createApp();
    const res = await request(app).get('/api/v1/comparison').query({ originMarketId: 1, targetMarketId: 1, productId: 1 });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.match(/origem e destino/);
  });

  it('GET /api/v1/comparison missing price returns 422 and Unprocessable Entity', async () => {
    // seed product but only one price
    const products = [{ id: 1, name: 'Café', available: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
    const prices = [{ id: 1, marketId: 1, productId: 1, priceInCents: 1000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
    dataDir = await seedToDir({ products, prices });
    app = createApp({ dataDirectory: dataDir });

    const res = await request(app).get('/api/v1/comparison').query({ originMarketId: 1, targetMarketId: 2, productId: 1 });
    expect(res.status).to.equal(422);
    expect(res.body.error).to.equal('Unprocessable Entity');
    expect(res.body.message).to.match(/não possui preço/);
  });

  it('POST /api/v1/products with invalid JSON returns 400 and JSON inválido message', async () => {
    dataDir = await seedToDir();
    app = createApp({ dataDirectory: dataDir });

    const res = await request(app).post('/api/v1/products').set('Content-Type', 'application/json').send('{"name":');
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('JSON inválido.');
  });
});
