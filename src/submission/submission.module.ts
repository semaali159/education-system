import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './submission.entity';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { Assignment } from '../assignment/assignment.entity';
import { User } from 'src/User/user.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, Assignment, User]),
    CloudinaryModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
