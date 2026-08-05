const { success } = require('./response');
module.exports = (productService) => ({
  create: async (req, res) => success(res, await productService.create(req.body), 201),
  list: async (req, res) => success(res, await productService.list(req.query.search)),
  updateAvailability: async (req, res) => success(res, await productService.updateAvailability(Number(req.params.id), req.body.available))
});
