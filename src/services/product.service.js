const { NotFoundError } = require('../utils/app-error');

class ProductService {
  constructor(productRepository) { this.productRepository = productRepository; }
  async create(data) { return this.productRepository.create(data); }
  async list(search) { return this.productRepository.findAll(search); }
  async findOrFail(id, notFoundError = new NotFoundError('Produto não encontrado.')) {
    const product = await this.productRepository.findById(id);
    if (!product) throw notFoundError;
    return product;
  }
  async updateAvailability(id, available) { return this.productRepository.updateAvailability(await this.findOrFail(id), available); }
}

module.exports = ProductService;
