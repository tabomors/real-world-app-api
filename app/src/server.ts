import 'reflect-metadata';
import { getConnectionOptions } from 'typeorm';
import connection from './lib/connection';
import dotenv from 'dotenv';
import app from './app';
import http from 'http';

dotenv.config();
const PORT = process.env.PORT || 3000;

async function main() {
  const connectionOptions = await getConnectionOptions();

  try {
    await connection.create(connectionOptions);
    app.set('port', PORT);

    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (e) {
    console.error("Can't connect to db", e);
    process.exit(1);
  }
}

main();
