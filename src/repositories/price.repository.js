const path = require('path');
const { now } = require('../utils/date');
const JsonDataStore = require('./json-data-store');

class PriceRepository {
  constructor(dataDirectory = path.join(__dirname, '..', 'resources', 'data')) { this.store = new JsonDataStore('prices.json', [], dataDirectory); }

  async findById(id) { return (await this.store.read()).find((price) => price.id === id); }
  async findByMarketAndProduct(marketId, productId) { return (await this.store.read()).find((price) => price.marketId === marketId && price.productId === productId); }
  async findAll({ marketId, productId }) { return (await this.store.read()).filter((price) => (!marketId || price.marketId === marketId) && (!productId || price.productId === productId)); }

  async createIfAbsent({ marketId, productId, priceInCents }) {
    const timestamp = now();
    return this.store.update((prices) => {
      if (prices.some((item) => item.marketId === marketId && item.productId === productId)) return null;
      const nextId = prices.length ? Math.max(...prices.map((item) => item.id)) + 1 : 1;
      const entry = { id: nextId, marketId, productId, priceInCents, createdAt: timestamp, updatedAt: timestamp };
      prices.push(entry);
      return entry;
    });
  }

  async updatePrice(priceId, priceInCents) {
    return this.store.update((prices) => {
      const entry = prices.find((item) => item.id === priceId);
      entry.priceInCents = priceInCents;
      entry.updatedAt = now();
      return entry;
    });
  }
}

module.exports = PriceRepository;
