const { AppError } = require('../utils/app-error');
const { fromCents } = require('../utils/money');

class ComparisonService {
  constructor(marketRepository, productRepository, priceRepository) {
    this.marketRepository = marketRepository;
    this.productRepository = productRepository;
    this.priceRepository = priceRepository;
  }

  async compare({ originMarketId, targetMarketId, productId }) {
    if (originMarketId === targetMarketId) throw new AppError(400, 'Os mercados de origem e destino devem ser diferentes.');
    const product = await this.productRepository.findById(productId);
    if (!product) throw new AppError(400, 'Produto não encontrado.');
    if (!product.available) throw new AppError(400, 'Produto indisponível para comparação.');
    const [originMarket, targetMarket] = await Promise.all([this.marketRepository.findById(originMarketId), this.marketRepository.findById(targetMarketId)]);
    if (!originMarket || !targetMarket) throw new AppError(400, 'Mercado não encontrado.');
    const [originPrice, targetPrice] = await Promise.all([this.priceRepository.findByMarketAndProduct(originMarketId, productId), this.priceRepository.findByMarketAndProduct(targetMarketId, productId)]);
    if (!originPrice) throw new AppError(422, `O mercado ${originMarket.name} não possui preço cadastrado para este produto.`, 'Unprocessable Entity');
    if (!targetPrice) throw new AppError(422, `O mercado ${targetMarket.name} não possui preço cadastrado para este produto.`, 'Unprocessable Entity');
    const markets = [
      { id: originMarket.id, name: originMarket.name, price: fromCents(originPrice.priceInCents) },
      { id: targetMarket.id, name: targetMarket.name, price: fromCents(targetPrice.priceInCents) }
    ];
    const data = { product: { id: product.id, name: product.name }, markets };
    if (originPrice.priceInCents === targetPrice.priceInCents) return { ...data, message: 'Os dois mercados possuem o mesmo preço.' };
    const winner = originPrice.priceInCents < targetPrice.priceInCents ? { market: originMarket, priceInCents: originPrice.priceInCents, otherInCents: targetPrice.priceInCents } : { market: targetMarket, priceInCents: targetPrice.priceInCents, otherInCents: originPrice.priceInCents };
    return { ...data, bestPrice: { marketId: winner.market.id, marketName: winner.market.name, price: fromCents(winner.priceInCents), saving: fromCents(winner.otherInCents - winner.priceInCents) } };
  }
}

module.exports = ComparisonService;
