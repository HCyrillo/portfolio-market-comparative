const { AppError, NotFoundError } = require('../utils/app-error');

class MarketService {
  constructor(marketRepository) { this.marketRepository = marketRepository; }
  async list() { return this.marketRepository.findAll(); }
  async findOrFail(id, status = 404) {
    const market = await this.marketRepository.findById(id);
    if (!market) throw status === 400 ? new AppError(400, 'Mercado não encontrado.') : new NotFoundError('Mercado não encontrado.');
    return market;
  }
}

module.exports = MarketService;
