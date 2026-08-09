const path = require('path');
const Product = require('../models/product.model');
const { now } = require('../utils/date');
const JsonDataStore = require('./json-data-store');

class ProductRepository {
  constructor(dataDirectory = path.join(__dirname, '..', 'resources', 'data')) { this.store = new JsonDataStore('products.json', [], dataDirectory); }

  async create({ name, category, available }) {
    const timestamp = now();
    return this.store.update((products) => {
      const nextId = products.length ? Math.max(...products.map((product) => product.id)) + 1 : 1;
      const product = new Product({ id: nextId, name, category, available, createdAt: timestamp, updatedAt: timestamp });
      products.push(product);
      return product;
    });
  }

  async findAll(search) {
    const term = search?.toLocaleLowerCase('pt-BR');
    const products = await this.store.read();
    return term ? products.filter((product) => product.name.toLocaleLowerCase('pt-BR').includes(term)) : products;
  }

  async findById(id) { return (await this.findAll()).find((product) => product.id === id); }

  async updateAvailability(product, available) {
    return this.store.update((products) => {
      const storedProduct = products.find((item) => item.id === product.id);
      storedProduct.available = available;
      storedProduct.updatedAt = now();
      return storedProduct;
    });
  }
}

module.exports = ProductRepository;
