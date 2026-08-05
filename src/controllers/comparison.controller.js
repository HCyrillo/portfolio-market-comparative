const { success } = require('./response');
module.exports = (comparisonService) => ({ compare: async (req, res) => success(res, await comparisonService.compare({ originMarketId: Number(req.query.originMarketId), targetMarketId: Number(req.query.targetMarketId), productId: Number(req.query.productId) })) });
