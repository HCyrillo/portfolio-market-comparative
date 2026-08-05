const { createApp } = require('./app');
const port = process.env.PORT || 3000;
const app = createApp();
const server = app.listen(port, () => console.log(`Market Comparative API running at http://localhost:${port}`));

const shutdown = (signal) => {
  console.log(`${signal} recebido. Encerrando servidor HTTP.`);
  server.close(() => process.exit(0));
};

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
