const { expect } = require('chai');
const { buildContainer } = require('../../src/config/container');
const { seedToDir, removeDataDirectory } = require('../helpers/fixtures');

describe('ProductService integration', () => {
  let directory;
  let services;

  beforeEach(async () => {
    directory = await seedToDir();
    services = buildContainer({ dataDirectory: directory });
  });

  afterEach(async () => {
    await removeDataDirectory(directory);
  });

  it('[TS-AVL-001][RSK-005] persiste alteração de disponibilidade do produto', async () => {
    const product = await services.productService.create({
      name: 'Café',
      category: 'Mercearia',
      available: true
    });

    const updated = await services.productService.updateAvailability(product.id, false);
    const listed = await services.productService.list('CAFÉ');

    expect(updated.available).to.equal(false);
    expect(listed[0].id).to.equal(product.id);
    expect(listed[0].available).to.equal(false);
  });
});
