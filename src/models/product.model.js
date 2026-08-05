class Product {
  constructor({ id, name, category, available, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.available = available;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = Product;
