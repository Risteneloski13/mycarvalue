import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
// 1. Import the DataSource from your new file
import { AppDataSource } from './db/data-source';
// configModule is what we are going to use to specify which
// of .env files we want to read. While Service is what is going
// to expose the information inside those files to our app
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       //When working in dev environment we can set synchronize
    //       //to true but before deploying to production synchronize
    //       //should be false and never turning it to true again
    //       synchronize: true,
    //       entities: [User, Report],
    //     };
    //   },
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: false,
    // }),
    // 2. Pass the options directly from the DataSource instance
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // below we have globally scoped pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    // this below is a globally scoped middleware whenever we start up our app
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      ) // this means that we want to make use of this middleware,
      // cookieSession({keys: ['qwerqwer']}) on every single
      // incoming request that flows into our entire app. It means global middleware
      .forRoutes('*');
  }
}
