const request = require('supertest');
const { expect } = require('chai');
const { createApp } = require('../../src/app');
const { seedToDir, removeDataDirectory } = require('../helpers/fixtures');
const { logEvidence } = require('../helpers/evidence');

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

    logEvidence('[TS-PRD-001] cadastra produto válido', {
      method: 'POST',
      url: '/api/v1/products',
      body: { name: 'Arroz', category: 'Mercearia', available: true },
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });

  it('[TS-PRD-002] rejeita produto sem nome', async () => {
    const response = await api.post('/api/v1/products')
      .send({ category: 'Bebidas', available: true })
      .expect(400);

    expect(response.body).to.have.keys(['timestamp', 'status', 'error', 'message']);
    expect(response.body.message).to.equal('Nome é obrigatório.');

    logEvidence('[TS-PRD-002] rejeita produto sem nome', {
      method: 'POST',
      url: '/api/v1/products',
      body: { category: 'Bebidas', available: true },
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });

  it('[TS-PRD-003] consulta produtos cadastrados', async () => {
    const created = (await api.post('/api/v1/products')
      .send({ name: 'Feijão', category: 'Mercearia', available: true })
      .expect(201)).body.data;

    const response = await api.get('/api/v1/products').expect(200);

    expect(response.body.data).to.deep.include(created);

    logEvidence('[TS-PRD-003] consulta produtos cadastrados', {
      method: 'GET',
      url: '/api/v1/products',
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });

  it('[TS-PRD-004] busca produto por parte do nome sem diferenciar maiúsculas', async () => {
    await api.post('/api/v1/products')
      .send({ name: 'Coca-Cola Original', category: 'Bebidas', available: true })
      .expect(201);
    await api.post('/api/v1/products')
      .send({ name: 'Arroz', category: 'Mercearia', available: true })
      .expect(201);

    const response = await api.get('/api/v1/products').query({ search: 'COCA' }).expect(200);

    expect(response.body.data).to.have.lengthOf(1);
    expect(response.body.data[0].name).to.equal('Coca-Cola Original');

    logEvidence('[TS-PRD-004] busca produto por parte do nome sem diferenciar maiúsculas', {
      method: 'GET',
      url: '/api/v1/products',
      query: { search: 'COCA' },
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });

  it('[TS-AVL-002][RSK-005] reativa produto indisponível', async () => {
    const product = (await api.post('/api/v1/products')
      .send({ name: 'Leite', category: 'Laticínios', available: false })
      .expect(201)).body.data;

    const response = await api.patch(`/api/v1/products/${product.id}/availability`)
      .send({ available: true })
      .expect(200);

    expect(response.body.data).to.include({ id: product.id, available: true });

    logEvidence('[TS-AVL-002][RSK-005] reativa produto indisponível', {
      method: 'PATCH',
      url: `/api/v1/products/${product.id}/availability`,
      body: { available: true },
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });

  it('[TS-AVL-003][RSK-006] rejeita alteração de produto inexistente', async () => {
    const response = await api.patch('/api/v1/products/999/availability')
      .send({ available: false })
      .expect(404);

    expect(response.body.message).to.equal('Produto não encontrado.');

    logEvidence('[TS-AVL-003][RSK-006] rejeita alteração de produto inexistente', {
      method: 'PATCH',
      url: '/api/v1/products/999/availability',
      body: { available: false },
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });

  it('[EXP-001] rejeita campos adicionais não permitidos', async () => {
    const response = await api.post('/api/v1/products')
      .send({ name: 'X', category: 'Y', available: true, extra: 'no' })
      .expect(400);

    expect(response.body.message).to.equal('Body contém campos não permitidos.');

    logEvidence('[EXP-001] rejeita campos adicionais não permitidos', {
      method: 'POST',
      url: '/api/v1/products',
      body: { name: 'X', category: 'Y', available: true, extra: 'no' },
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });

  it('[EXP-001] rejeita JSON inválido', async () => {
    const response = await api.post('/api/v1/products')
      .set('Content-Type', 'application/json')
      .send('{"name":')
      .expect(400);

    expect(response.body.message).to.equal('JSON inválido.');

    logEvidence('[EXP-001] rejeita JSON inválido', {
      method: 'POST',
      url: '/api/v1/products',
      body: '{"name":',
      response: { status: response.status, statusText: response.statusText, body: response.body }
    });
  });
});
