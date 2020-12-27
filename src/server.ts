
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
  await connection.create(connectionOptions);
  app.set('port', PORT);

  const server = http.createServer(app);
  server.listen(PORT);
}

main();

