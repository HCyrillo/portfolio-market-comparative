const { AppError, NotFoundError } = require('../utils/app-error');

class ProductService {
  constructor(productRepository) { this.productRepository = productRepository; }
  async create(data) { return this.productRepository.create(data); }
  async list(search) { return this.productRepository.findAll(search); }
  async findOrFail(id, status = 404) {
    const product = await this.productRepository.findById(id);
    if (!product) throw status === 400 ? new AppError(400, 'Produto não encontrado.') : new NotFoundError('Produto não encontrado.');
    return product;
  }
  async updateAvailability(id, available) { return this.productRepository.updateAvailability(await this.findOrFail(id), available); }
}

module.exports = ProductService;
