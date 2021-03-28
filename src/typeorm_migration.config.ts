require('./dotenv-config');
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { typeORMConfig } from './typeorm.config';

const config: TypeOrmModuleOptions = {
  ...typeORMConfig,
  migrations: ['./src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export = config;
