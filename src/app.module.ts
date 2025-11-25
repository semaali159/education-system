/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './User/user.module';
import { User } from './User/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { TenantModule } from './tenants/tenant.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    // TenantModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          database: config.get<string>('DB_NAME'),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          port: config.get<number>('DB_PORT'),
          host: 'localhost',
          synchronize: process.env.NODE_ENV !== 'production',
          entities: [User],
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
