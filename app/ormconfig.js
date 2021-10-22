module.exports = {
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
  logging: true,
  type: 'postgres',
  entities: ['src/**/*.entity.js', 'src/**/*.entity.ts'],
  migrationsRun: true,
  migrations: ['src/migrations/*.js', 'src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  cli: {
    migrationsDir: 'src/migrations',
  },
};
