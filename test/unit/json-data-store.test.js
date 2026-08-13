const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { randomUUID } = require('crypto');
const JsonDataStore = require('../../src/repositories/json-data-store');

describe('JsonDataStore (unit)', () => {
  let tmpDir;
  beforeEach(async () => {
    tmpDir = path.join(os.tmpdir(), `mc-test-${Date.now()}-${randomUUID()}`);
    await fs.mkdir(tmpDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  });

  it('creates file with default data when missing and reads it', async () => {
    const filename = 'store.json';
    const defaultData = [{ id: 1, name: 'Default' }];
    const store = new JsonDataStore(filename, defaultData, tmpDir);
    const data = await store.read();
    expect(data).to.deep.equal(defaultData);
  });

  it('update mutator changes data and persists', async () => {
    const filename = 'store2.json';
    const defaultData = [];
    const store = new JsonDataStore(filename, defaultData, tmpDir);

    const added = await store.update(async (data) => {
      const newObj = { id: 1, name: 'Novo' };
      data.push(newObj);
      return newObj;
    });

    expect(added).to.deep.equal({ id: 1, name: 'Novo' });

    const readBack = await store.read();
    expect(readBack).to.be.an('array').with.lengthOf(1);
    expect(readBack[0]).to.deep.equal(added);
  });
});
