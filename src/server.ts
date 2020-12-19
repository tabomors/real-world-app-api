import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import swaggerUi from 'swagger-ui-express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import userRoutes from './user/Users.route';
import swaggerDoc from '../swagger.json';

const PORT = process.env.PORT || 3000;

createConnection({
  type: 'postgres',
  host: process.env.HOST,
  username: process.env.USERNAME,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
}).then(async (connection) => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  app.use('/api/users', userRoutes);

  app.get('/api', (req, res) => {
    res.send('Hello World');
  });

  app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
  });
});
