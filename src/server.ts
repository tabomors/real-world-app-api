
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';
import app from './app';
import http from 'http';

dotenv.config();
const PORT = process.env.PORT || 3000;

async function main() {
  await createConnection();
  app.set('port', PORT);

  const server = http.createServer(app);
  server.listen(PORT);
}

main();

