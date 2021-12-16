const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;

module.exports = {
  'type': process.env.TORM_CONNECTION,
  'host': process.env.TORM_HOST,
  'port': process.env.TORM_PORT,
  'username': process.env.TORM_USERNAME,
  'password': process.env.TORM_PASSWORD,
  'database': process.env.TORM_DATABASE,
  'entities': ['dist/**/*.entity.js'],
  'migrations': ['dist/migrations/*.js'],
  'cli': {
    'migrationsDir': 'migrations',
  },
  'logging': true,
  'synchronize': false,
  namingStrategy: new SnakeNamingStrategy(),
}