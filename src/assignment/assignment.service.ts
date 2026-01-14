import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { Course } from 'src/courses/course.entity';
import { CreateAssignmentDto } from './dtos/createAssignment.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { SubmissionType } from '../common/enums/submission-type';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,

    @InjectRepository(Course)
    private courseRepo: Repository<Course>,

    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    courseId: number,
    dto: CreateAssignmentDto,
    teacherId: number,
    file?: Express.Multer.File,
  ) {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['teacher'],
    });

    if (!course) throw new NotFoundException('Course not found');

    if (course.teacher.id !== teacherId) {
      throw new ForbiddenException('Not your course');
    }

    if (dto.submissionType === SubmissionType.FILE && !file) {
      throw new BadRequestException('File is required for this assignment');
    }

    let fileUrl: string | undefined;
    let filePublicId: string | undefined;

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(file);
      fileUrl = uploadResult.secure_url;
      filePublicId = uploadResult.public_id;
    }
    if(!filePublicId || !fileUrl ){
      throw new BadRequestException('upload file failds')
    }
    const assignment = this.assignmentRepo.create({
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate,
      submissionType: dto.submissionType,
      fileUrl,
      filePublicId,
      course,
    });

    return this.assignmentRepo.save(assignment);
  }
    async getCourseAssignments(courseId: number) {
    return this.assignmentRepo.find({
      where: { course: { id: courseId } },
      order: { createdAt: 'DESC' },
    });
  }
}
