const fs = require('fs/promises');
const os = require('os');
const path = require('path');

const seed = {
  markets: [
    { id: 1, name: 'Mercado A', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
    { id: 2, name: 'Mercado B', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' }
  ],
  products: [],
  prices: []
};

const createDataDirectory = async (overrides = {}) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'market-api-test-'));
  const data = { ...seed, ...overrides };
  await Promise.all(Object.entries(data).map(([name, records]) => fs.writeFile(path.join(directory, `${name}.json`), JSON.stringify(records))));
  return directory;
};

const removeDataDirectory = (directory) => fs.rm(directory, { recursive: true, force: true });

module.exports = { createDataDirectory, removeDataDirectory };
