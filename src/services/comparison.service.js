const { AppError } = require('../utils/app-error');
const { fromCents } = require('../utils/money');

class ComparisonService {
  constructor(marketService, productService, priceService) {
    this.marketService = marketService;
    this.productService = productService;
    this.priceService = priceService;
  }

  async compare({ originMarketId, targetMarketId, productId }) {
    if (originMarketId === targetMarketId) throw new AppError(400, 'Os mercados de origem e destino devem ser diferentes.');
    const product = await this.productService.findOrFail(productId, 400);
    if (!product.available) throw new AppError(400, 'Produto indisponível para comparação.');
    const originMarket = await this.marketService.findOrFail(originMarketId, 400);
    const targetMarket = await this.marketService.findOrFail(targetMarketId, 400);
    const [originPrice, targetPrice] = await Promise.all([this.priceService.findForMarketAndProduct(originMarketId, productId), this.priceService.findForMarketAndProduct(targetMarketId, productId)]);
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
