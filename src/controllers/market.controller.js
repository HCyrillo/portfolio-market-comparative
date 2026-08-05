const { success } = require('./response');
module.exports = (marketService) => ({ list: async (_req, res) => success(res, await marketService.list()) });
