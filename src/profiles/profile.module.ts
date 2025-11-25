import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentProfile } from './entities/student-profile.entity';
import { TeacherProfile } from './entities/teacher-profile';
import { ProfilesService } from './profile.service';
import { ProfilesController } from './profile.controller';
import { User } from '../User/user.entity';
@Module({
imports: [TypeOrmModule.forFeature([StudentProfile, TeacherProfile, User])],
providers: [ProfilesService],
controllers: [ProfilesController],
exports: [ProfilesService],
})
export class ProfilesModule {}
