const path = require('path');
const MarketRepository = require('../repositories/market.repository');
const ProductRepository = require('../repositories/product.repository');
const PriceRepository = require('../repositories/price.repository');
const MarketService = require('../services/market.service');
const ProductService = require('../services/product.service');
const PriceService = require('../services/price.service');
const ComparisonService = require('../services/comparison.service');

const buildContainer = ({ dataDirectory = process.env.DATA_DIR || path.join(__dirname, '..', 'resources', 'data') } = {}) => {
  const marketService = new MarketService(new MarketRepository(dataDirectory));
  const productService = new ProductService(new ProductRepository(dataDirectory));
  const priceService = new PriceService(new PriceRepository(dataDirectory), marketService, productService);
  return { marketService, productService, priceService, comparisonService: new ComparisonService(marketService, productService, priceService) };
};

module.exports = { buildContainer };
