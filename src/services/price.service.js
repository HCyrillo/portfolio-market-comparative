const { ConflictError, NotFoundError } = require('../utils/app-error');
const { toCents, fromCents } = require('../utils/money');

class PriceService {
  constructor(priceRepository, marketService, productService) {
    this.priceRepository = priceRepository;
    this.marketService = marketService;
    this.productService = productService;
  }

  async create({ marketId, productId, price }) {
    await this.marketService.findOrFail(marketId);
    await this.productService.findOrFail(productId);
    const entry = await this.priceRepository.createIfAbsent({ marketId, productId, priceInCents: toCents(price) });
    if (!entry) throw new ConflictError('Já existe preço cadastrado para este mercado e produto.');
    return this.serialize(entry);
  }

  async update(priceId, price) {
    if (!await this.priceRepository.findById(priceId)) throw new NotFoundError('Preço não encontrado.');
    return this.serialize(await this.priceRepository.updatePrice(priceId, toCents(price)));
  }

  async list(filters) {
    const [prices, markets, products] = await Promise.all([this.priceRepository.findAll(filters), this.marketService.list(), this.productService.list()]);
    const marketsById = new Map(markets.map((market) => [market.id, market]));
    const productsById = new Map(products.map((product) => [product.id, product]));
    return prices.map((price) => ({ market: { id: price.marketId, name: marketsById.get(price.marketId).name }, product: { id: price.productId, name: productsById.get(price.productId).name }, price: fromCents(price.priceInCents) }));
  }

  async findForMarketAndProduct(marketId, productId) { return this.priceRepository.findByMarketAndProduct(marketId, productId); }
  serialize({ priceInCents, ...price }) { return { ...price, price: fromCents(priceInCents) }; }
}

module.exports = PriceService;
