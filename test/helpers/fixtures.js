const { createDataDirectory, removeDataDirectory } = require('./data-directory');

const nowIso = () => new Date().toISOString();

const makeMarket = (id = 1, name = `Mercado ${id}`) => ({
  id,
  name,
  createdAt: nowIso(),
  updatedAt: nowIso()
});

const makeProduct = (id = 1, name = 'Produto', available = true) => ({
  id,
  name,
  available,
  createdAt: nowIso(),
  updatedAt: nowIso()
});

const makePrice = (id = 1, marketId = 1, productId = 1, priceInCents = 1000) => ({
  id,
  marketId,
  productId,
  priceInCents,
  createdAt: nowIso(),
  updatedAt: nowIso()
});

const defaultSeed = {
  markets: [makeMarket(1, 'Mercado A'), makeMarket(2, 'Mercado B')],
  products: [],
  prices: []
};

const buildSeed = ({ markets = defaultSeed.markets, products = defaultSeed.products, prices = defaultSeed.prices } = {}) => ({ markets, products, prices });

const seedToDir = async (overrides = {}) => {
  const seed = buildSeed(overrides);
  return createDataDirectory(seed);
};

module.exports = {
  makeMarket,
  makeProduct,
  makePrice,
  defaultSeed,
  buildSeed,
  seedToDir,
  removeDataDirectory
};
