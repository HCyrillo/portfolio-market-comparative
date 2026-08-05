const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { buildContainer } = require('./config/container');
const { API_PREFIX } = require('./config/constants');
const healthRoutes = require('./routes/health.routes');
const marketRoutes = require('./routes/market.routes');
const productRoutes = require('./routes/product.routes');
const priceRoutes = require('./routes/price.routes');
const comparisonRoutes = require('./routes/comparison.routes');
const notFound = require('./middlewares/not-found');
const errorHandler = require('./middlewares/error-handler');

const createApp = (options = {}) => {
  const app = express();
  const container = buildContainer(options);
  const swaggerDocument = YAML.load(`${__dirname}/resources/swagger/swagger.yaml`);
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(express.json({ limit: '100kb' }));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(`${API_PREFIX}/health`, healthRoutes);
  app.use(`${API_PREFIX}/markets`, marketRoutes(container.marketService));
  app.use(`${API_PREFIX}/products`, productRoutes(container.productService));
  app.use(`${API_PREFIX}/prices`, priceRoutes(container.priceService));
  app.use(`${API_PREFIX}/comparison`, comparisonRoutes(container.comparisonService));
  app.use(notFound);
  app.use(errorHandler);
  return app;
};

module.exports = { createApp };
