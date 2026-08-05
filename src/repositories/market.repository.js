const Market = require('../models/market.model');
const { now } = require('../utils/date');
const JsonDataStore = require('./json-data-store');

class MarketRepository {
  constructor(dataDirectory) {
    const timestamp = now();
    const markets = ['Assaí', 'Extra', 'Sonda', 'Carrefour'].map((name, index) => new Market({
      id: index + 1, name, createdAt: timestamp, updatedAt: timestamp
    }));
    this.store = new JsonDataStore('markets.json', markets, dataDirectory);
  }

  async findAll() { return this.store.read(); }
  async findById(id) { return (await this.findAll()).find((market) => market.id === id); }
}

module.exports = MarketRepository;
