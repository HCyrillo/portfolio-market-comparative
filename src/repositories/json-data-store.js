const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const { PersistenceError } = require('../utils/app-error');

class JsonDataStore {
  constructor(filename, defaultData = [], dataDirectory) {
    this.filepath = path.join(dataDirectory, filename);
    this.defaultData = defaultData;
    this.queue = this.ensureFile();
  }

  async ensureFile() {
    await fs.mkdir(path.dirname(this.filepath), { recursive: true });
    try {
      await fs.access(this.filepath);
    } catch {
      await this.writeAtomic(this.defaultData);
    }
  }

  async read() {
    await this.queue;
    return this.readUnsafe();
  }

  async update(mutator) {
    const operation = this.queue.then(async () => {
      const data = await this.readUnsafe();
      const result = await mutator(data);
      await this.writeAtomic(data);
      return result;
    });
    this.queue = operation.catch(() => undefined);
    return operation;
  }

  async readUnsafe() {
    try {
      return JSON.parse(await fs.readFile(this.filepath, 'utf8'));
    } catch {
      throw new PersistenceError(`Não foi possível ler a base local: ${path.basename(this.filepath)}.`);
    }
  }

  async writeAtomic(data) {
    const temporaryPath = `${this.filepath}.${process.pid}.${randomUUID()}.tmp`;
    try {
      await fs.writeFile(temporaryPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
      await fs.rename(temporaryPath, this.filepath);
    } catch {
      throw new PersistenceError(`Não foi possível gravar a base local: ${path.basename(this.filepath)}.`);
    }
  }
}

module.exports = JsonDataStore;
