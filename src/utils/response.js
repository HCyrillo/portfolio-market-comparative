const { now } = require('./date');

const success = (res, data, status = 200) => res.status(status).json({ data, metadata: { timestamp: now() } });

module.exports = { success };
