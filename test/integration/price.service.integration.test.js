const { expect } = require('chai');
const { buildContainer } = require('../../src/config/container');
const { seedToDir, removeDataDirectory } = require('../helpers/fixtures');

describe('PriceService integration', () => {
  let directory;
  let services;

  beforeEach(async () => {
    directory = await seedToDir();
    services = buildContainer({ dataDirectory: directory });
  });

  afterEach(async () => {
    await removeDataDirectory(directory);
  });

  it('[TS-PRC-008][RSK-004] persiste atualização e mantém relacionamento de preço', async () => {
    const product = await services.productService.create({
      name: 'Café',
      category: 'Mercearia',
      available: true
    });
    const price = await services.priceService.create({ marketId: 1, productId: product.id, price: 8.9 });

    const updated = await services.priceService.update(price.id, 9.5);
    const listed = await services.priceService.list({ marketId: 1, productId: product.id });

    expect(updated.price).to.equal(9.5);
    expect(listed).to.have.lengthOf(1);
    expect(listed[0]).to.deep.equal({
      market: { id: 1, name: 'Mercado A' },
      product: { id: product.id, name: 'Café' },
      price: 9.5
    });
  });

  it('[RSK-004] impede preço duplicado mesmo com criações concorrentes', async () => {
    const product = await services.productService.create({
      name: 'Café',
      category: 'Mercearia',
      available: true
    });

    const results = await Promise.allSettled([
      services.priceService.create({ marketId: 1, productId: product.id, price: 8.9 }),
      services.priceService.create({ marketId: 1, productId: product.id, price: 9.5 })
    ]);

    expect(results.filter(({ status }) => status === 'fulfilled')).to.have.lengthOf(1);
    expect(results.filter(({ status }) => status === 'rejected')).to.have.lengthOf(1);
    expect(results.find(({ status }) => status === 'rejected').reason.status).to.equal(409);
  });
});
