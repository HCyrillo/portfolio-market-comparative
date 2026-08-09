const path = require('path');
const JsonDataStore = require('./json-data-store');

class MarketRepository {
  constructor(dataDirectory = path.join(__dirname, '..', 'resources', 'data')) {
    this.store = new JsonDataStore('markets.json', [], dataDirectory);
  }

  async findAll() { return this.store.read(); }
  async findById(id) { return (await this.findAll()).find((market) => market.id === id); }
}

module.exports = MarketRepository;
