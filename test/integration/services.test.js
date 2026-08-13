const { buildContainer } = require('../../src/config/container');
const { seedToDir, removeDataDirectory } = require('../helpers/fixtures');

describe('services com persistência JSON', () => {
  let directory;
  let services;

  beforeEach(async () => {
    directory = await seedToDir();
    services = buildContainer({ dataDirectory: directory });
  });

  afterEach(() => removeDataDirectory(directory));

  it('persiste produto e alteração de disponibilidade', async () => {
    const product = await services.productService.create({ name: 'Café', category: 'Mercearia', available: true });
    const updated = await services.productService.updateAvailability(product.id, false);
    expect(updated.available).to.equal(false);
    expect((await services.productService.list('CAFÉ'))[0].id).to.equal(product.id);
  });

  it('persiste, atualiza e relaciona preços', async () => {
    const product = await services.productService.create({ name: 'Café', category: 'Mercearia', available: true });
    const price = await services.priceService.create({ marketId: 1, productId: product.id, price: 8.9 });
    const updated = await services.priceService.update(price.id, 9.5);
    const listed = await services.priceService.list({ marketId: 1, productId: product.id });
    expect(updated.price).to.equal(9.5);
    expect(listed[0]).to.deep.equal({ market: { id: 1, name: 'Mercado A' }, product: { id: product.id, name: 'Café' }, price: 9.5 });
  });

  it('impede preço duplicado mesmo com criações concorrentes', async () => {
    const product = await services.productService.create({ name: 'Café', category: 'Mercearia', available: true });
    const results = await Promise.allSettled([
      services.priceService.create({ marketId: 1, productId: product.id, price: 8.9 }),
      services.priceService.create({ marketId: 1, productId: product.id, price: 9.5 })
    ]);
    expect(results.filter(({ status }) => status === 'fulfilled').length).to.equal(1);
    expect(results.find(({ status }) => status === 'rejected').reason.status).to.equal(409);
  });
});
