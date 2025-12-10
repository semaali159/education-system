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
import { ProfilesModule } from './profiles/profile.module';
import { StudentProfile } from './profiles/entities/student-profile.entity';
import { TeacherProfile } from './profiles/entities/teacher-profile.entity';
import { CourseModule } from './courses/course.module';
import { CourseSessionsModule } from './course-sessions/course-sessions.module';
// import { TenantModule } from './tenants/tenant.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProfilesModule,
    CourseModule,
    CourseSessionsModule,
    // TenantModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get<string>('DB_HOST'),
    port: config.get<number>('DB_PORT'),
    username: config.get<string>('DB_USER'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_NAME'),
    synchronize: process.env.NODE_ENV !== 'production',  
    autoLoadEntities: true, 
  }),
}),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
