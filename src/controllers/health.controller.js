const { success } = require('./response');
const health = (_req, res) => success(res, { status: 'UP' });
module.exports = { health };
