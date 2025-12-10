import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from './user.schema';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Course } from 'src/courses/course.entity';

@Module({
  imports: [
TypeOrmModule.forFeature([User,Course]),
     ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
