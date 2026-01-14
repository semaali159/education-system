import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './submission.entity';
import { Assignment } from '../assignment/assignment.entity';
import { User } from 'src/User/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GradeSubmissionDto } from './dtos/gradeSubmission.dto';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepo: Repository<Submission>,
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {}


  async submit(
    assignmentId: number,
    file: Express.Multer.File,
    studentId: number,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const assignment = await this.assignmentRepo.findOne({
      where: { id: assignmentId },
      relations: ['course', 'course.students'],
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const isEnrolled = assignment.course.students.some(
      (s) => s.id === studentId,
    );
    if (!isEnrolled) {
      throw new ForbiddenException('Not enrolled in this course');
    }


    const existing = await this.submissionRepo.findOne({
      where: {
        assignment: { id: assignmentId },
        student: { id: studentId },
      },
    });

    if (existing) {
      throw new BadRequestException('You already submitted');
    }
    const upload = await this.cloudinaryService.uploadFile(file);

    const student = await this.userRepo.findOne({
      where: { id: studentId },
    });
if(!student){
    throw new BadRequestException("user not found")
}
    const submission = this.submissionRepo.create({
      assignment,
      student,
      fileUrl: upload.secure_url,
      filePublicId: upload.public_id,
    });

    return this.submissionRepo.save(submission);
  }


  async grade(
    submissionId: number,
    dto: GradeSubmissionDto,
    teacherId: number,
  ) {
    const submission = await this.submissionRepo.findOne({
      where: { id: submissionId },
      relations: ['assignment', 'assignment.course', 'assignment.course.teacher'],
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.assignment.course.teacher.id !== teacherId) {
      throw new ForbiddenException('Not course owner');
    }

    submission.grade = dto.grade;
    submission.feedback = dto.feedback;

    return this.submissionRepo.save(submission);
  }
  async getMySubmission(assignmentId: number, studentId: number) {
  return this.submissionRepo.findOne({
    where: {
      assignment: { id: assignmentId },
      student: { id: studentId },
    },
  });
}

async getAssignmentSubmissions(
  assignmentId: number,
  teacherId: number,
) {
  const assignment = await this.assignmentRepo.findOne({
    where: { id: assignmentId },
    relations: ['course', 'course.teacher'],
  });

  if (!assignment) throw new NotFoundException('Assignment not found');
  if (assignment.course.teacher.id !== teacherId)
    throw new ForbiddenException('Not course owner');

  return this.submissionRepo.find({
    where: { assignment: { id: assignmentId } },
    relations: ['student'],
  });
}

}
