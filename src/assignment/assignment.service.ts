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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';
import { createCipheriv } from 'crypto';
import { CreateAssignmentResponseDto } from './dtos/response/createAssignment.dto';

@Injectable()
export class AssignmentService {
  constructor(
       private eventEmitter: EventEmitter2,
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

    let fileUrl: string | undefined;
    let filePublicId: string | undefined;
    if (dto.submissionType === SubmissionType.FILE) {  
        if (!file) {
    throw new BadRequestException('File is required for this assignment');
  }    
      const uploadResult = await this.cloudinaryService.uploadFile(file);
      fileUrl = uploadResult.secure_url;
      filePublicId = uploadResult.public_id;
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
    const savedAssignment = await this.assignmentRepo.save(assignment)
    this.eventEmitter.emit('assignment.created',{assignmentId:assignment.id,courseId: assignment.course.id,title: assignment.title }
    )
   console.log(savedAssignment)
    return plainToInstance(CreateAssignmentResponseDto,
      {
        title: savedAssignment.title,
        description: savedAssignment.description,
        dueDate: savedAssignment.dueDate,
        submissionType: savedAssignment.submissionType,
        teacher: {
          id: course.teacher.id,
          username: course.teacher.username,
        },
      },{excludeExtraneousValues: true}) ;
  }
    async getCourseAssignments(courseId: number) {
    return this.assignmentRepo.find({
      where: { course: { id: courseId } },
      order: { createdAt: 'DESC' },
    });
  }
}
