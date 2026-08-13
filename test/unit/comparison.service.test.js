const { expect } = require('chai');
const ComparisonService = require('../../src/services/comparison.service');

const rejectionFrom = (promise) => promise.then(
  () => { throw new Error('Era esperada uma rejeição.'); },
  (error) => error
);

const buildService = ({
  product = { id: 7, name: 'Arroz', available: true },
  prices = [890, 950]
} = {}) => {
  const markets = new Map([
    [1, { id: 1, name: 'Mercado A' }],
    [2, { id: 2, name: 'Mercado B' }]
  ]);

  return new ComparisonService(
    { findById: async (id) => markets.get(id) },
    { findById: async () => product },
    {
      findByMarketAndProduct: async (marketId) => prices[marketId - 1] == null
        ? undefined
        : { priceInCents: prices[marketId - 1] }
    }
  );
};

describe('ComparisonService', () => {
  it('[TS-CMP-001][RSK-001] identifica o menor preço e calcula a economia', async () => {
    const result = await buildService().compare({ originMarketId: 1, targetMarketId: 2, productId: 7 });

    expect(result.bestPrice).to.deep.equal({
      marketId: 1,
      marketName: 'Mercado A',
      price: 8.9,
      saving: 0.6
    });
  });

  it('[TS-CMP-002][RSK-001] identifica o segundo mercado como o mais barato', async () => {
    const result = await buildService({ prices: [950, 890] })
      .compare({ originMarketId: 1, targetMarketId: 2, productId: 7 });

    expect(result.bestPrice).to.deep.equal({
      marketId: 2,
      marketName: 'Mercado B',
      price: 8.9,
      saving: 0.6
    });
  });

  it('[TS-CMP-003][RSK-001] trata empate sem definir vencedor', async () => {
    const result = await buildService({ prices: [900, 900] })
      .compare({ originMarketId: 1, targetMarketId: 2, productId: 7 });

    expect(result.bestPrice).to.equal(undefined);
    expect(result.message).to.match(/mesmo preço/);
  });

  it('[TS-CMP-009] rejeita comparação entre o mesmo mercado', async () => {
    const error = await rejectionFrom(
      buildService().compare({ originMarketId: 1, targetMarketId: 1, productId: 7 })
    );

    expect(error).to.have.property('status', 400);
  });

  it('[TS-CMP-005][RSK-005] rejeita produto indisponível', async () => {
    const error = await rejectionFrom(
      buildService({ product: { id: 7, available: false } })
        .compare({ originMarketId: 1, targetMarketId: 2, productId: 7 })
    );

    expect(error).to.have.property('status', 400);
  });

  it('[TS-CMP-007][RSK-002] rejeita comparação quando um mercado não possui preço', async () => {
    const error = await rejectionFrom(
      buildService({ prices: [890] })
        .compare({ originMarketId: 1, targetMarketId: 2, productId: 7 })
    );

    expect(error).to.have.property('status', 422);
  });
});
