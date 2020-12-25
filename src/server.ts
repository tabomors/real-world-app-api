import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import swaggerUi from 'swagger-ui-express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { manyUsersRoutes, oneUserRoutes } from './user/Users.route';
import swaggerDoc from '../swagger.json';
import profileRoutes from './profile/Profile.route';
import articleRoutes from './article/Articles.route';
import tagRoutes from './article/Tags.route';

const PORT = process.env.PORT || 3000;

createConnection().then(async () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  app.use('/api/users', manyUsersRoutes);

  app.use('/api/user', oneUserRoutes);

  app.use('/api/profiles', profileRoutes);

  app.use('/api/articles', articleRoutes);

  app.use('/api/tags', tagRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
  });
});
