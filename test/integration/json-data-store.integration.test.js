const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { randomUUID } = require('crypto');
const { expect } = require('chai');
const JsonDataStore = require('../../src/repositories/json-data-store');

describe('JsonDataStore integration', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = path.join(os.tmpdir(), `mc-test-${Date.now()}-${randomUUID()}`);
    await fs.mkdir(tmpDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('cria arquivo com dados padrão quando inexistente e realiza leitura', async () => {
    const store = new JsonDataStore('store.json', [{ id: 1, name: 'Default' }], tmpDir);

    const data = await store.read();

    expect(data).to.deep.equal([{ id: 1, name: 'Default' }]);
  });

  it('persiste alterações realizadas pelo mutator', async () => {
    const store = new JsonDataStore('store.json', [], tmpDir);

    const added = await store.update(async (data) => {
      const newObject = { id: 1, name: 'Novo' };
      data.push(newObject);
      return newObject;
    });

    const readBack = await store.read();

    expect(added).to.deep.equal({ id: 1, name: 'Novo' });
    expect(readBack).to.deep.equal([added]);
  });
});
