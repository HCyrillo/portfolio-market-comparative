const router = require('express').Router();
const { success } = require('../utils/response');
router.get('/', (_req, res) => success(res, { status: 'UP' }));
module.exports = router;
