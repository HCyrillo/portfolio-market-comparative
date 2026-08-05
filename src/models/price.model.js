class Price {
  constructor({ id, marketId, productId, priceInCents, createdAt, updatedAt }) {
    this.id = id;
    this.marketId = marketId;
    this.productId = productId;
    this.priceInCents = priceInCents;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = Price;
