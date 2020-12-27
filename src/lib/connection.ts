import { createConnection, getConnection, ConnectionOptions } from 'typeorm';

const connection = {
  async create(options: ConnectionOptions) {
    return await createConnection(options);
  },

  async close() {
    return await getConnection().close();
  },

  async clear() {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    const promises = entities.map(async (entity) => {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
    return await Promise.all(promises);
  },
};

export default connection;
