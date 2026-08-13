const { expect } = require('chai');
const ComparisonService = require('../../src/services/comparison.service');

const buildService = ({ product = { id: 7, name: 'Arroz', available: true }, prices = [890, 950] } = {}) => {
  const markets = new Map([[1, { id: 1, name: 'Mercado A' }], [2, { id: 2, name: 'Mercado B' }]]);
  return new ComparisonService(
    { findById: async (id) => markets.get(id) },
    { findById: async () => product },
    { findByMarketAndProduct: async (marketId) => prices[marketId - 1] == null ? undefined : { priceInCents: prices[marketId - 1] } }
  );
};

describe('ComparisonService', () => {
  it('identifica o menor preço e calcula a economia', async () => {
    const result = await buildService().compare({ originMarketId: 1, targetMarketId: 2, productId: 7 });
    expect(result.bestPrice).to.deep.equal({ marketId: 1, marketName: 'Mercado A', price: 8.9, saving: 0.6 });
  });

  it('trata empate sem definir vencedor', async () => {
    const result = await buildService({ prices: [900, 900] }).compare({ originMarketId: 1, targetMarketId: 2, productId: 7 });
    expect(result.bestPrice).to.equal(undefined);
    expect(result.message).to.match(/mesmo preço/);
  });

  it('rejeita mercados iguais, produto indisponível e preço ausente', async () => {
    await expect(buildService().compare({ originMarketId: 1, targetMarketId: 1, productId: 7 })).to.be.rejected.and.have.property('status', 400);
    await expect(buildService({ product: { id: 7, available: false } }).compare({ originMarketId: 1, targetMarketId: 2, productId: 7 })).to.be.rejected.and.have.property('status', 400);
    await expect(buildService({ prices: [890] }).compare({ originMarketId: 1, targetMarketId: 2, productId: 7 })).to.be.rejected.and.have.property('status', 422);
  });
});
