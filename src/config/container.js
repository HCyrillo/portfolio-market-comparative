const path = require('path');
const MarketRepository = require('../repositories/market.repository');
const ProductRepository = require('../repositories/product.repository');
const PriceRepository = require('../repositories/price.repository');
const ProductService = require('../services/product.service');
const PriceService = require('../services/price.service');
const ComparisonService = require('../services/comparison.service');

const buildContainer = ({ dataDirectory = process.env.DATA_DIR || path.join(__dirname, '..', 'resources', 'data') } = {}) => {
  const marketRepository = new MarketRepository(dataDirectory);
  const productRepository = new ProductRepository(dataDirectory);
  const priceRepository = new PriceRepository(dataDirectory);
  const productService = new ProductService(productRepository);
  const priceService = new PriceService(priceRepository, marketRepository, productRepository);
  return {
    marketRepository,
    productService,
    priceService,
    comparisonService: new ComparisonService(marketRepository, productRepository, priceRepository)
  };
};

module.exports = { buildContainer };
