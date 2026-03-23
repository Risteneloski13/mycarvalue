import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity';
import { Report } from '../reports/report.entity';

let dbOptions: DataSourceOptions;

switch (process.env.NODE_ENV) {
  case 'development':
    dbOptions = {
      type: 'sqlite',
      database: 'db.sqlite',
      // In dev, we use the actual classes
      entities: [User, Report],
      // Point to the source migrations
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      synchronize: false,
    };
    break;

  case 'test':
    dbOptions = {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: [User, Report],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      synchronize: false,
      // Automatically run migrations before tests start
      migrationsRun: true,
    };
    break;

  case 'production':
    dbOptions = {
      type: 'postgres',
      // Postgres uses a connection URL in production
      url: process.env.DATABASE_URL,
      // In production, we point to the compiled javascript files in 'dist'
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
      synchronize: false,
      migrationsRun: true,
      ssl: {
        // Required for most cloud providers like Render/Heroku
        rejectUnauthorized: false,
      },
    };
    break;

  default:
    throw new Error('unknown environment');
}

export const AppDataSource = new DataSource(dbOptions);
