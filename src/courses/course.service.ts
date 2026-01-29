import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Course } from "./course.entity";
import { CreateCourseDto, UpdateCourseDto } from "./dtos/course.dto";
import { User } from "src/User/user.entity";
import { Enrollment } from "src/Enrollments/Enrollment.entity";
import { plainToInstance } from "class-transformer";
import { createCourseResponseDto } from "./dtos/course-response.dto";

@Injectable()
export class CourseService{
    constructor(
    @InjectRepository(Course)private readonly CourseRepository:Repository<Course>,
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
    @InjectRepository (Enrollment) private readonly enrollmentRepository: Repository<Enrollment>){}
async create(dto:CreateCourseDto,teacherId:number){
const teacher = await this.UserRepository.findOne({ where: { id: teacherId } });

    if (!teacher || teacher.role !== 'teacher') {
      throw new ForbiddenException('Only teachers can create courses');
    }

    const course = this.CourseRepository.create({
      ...dto,
      teacher,
    });

    const savedCourse = this.CourseRepository.save(course);
    return plainToInstance(createCourseResponseDto, savedCourse, {
    excludeExtraneousValues: true,  
  });
}
async update(id:number,dto: UpdateCourseDto, teacherId:number,){
       const course = await this.CourseRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });

    if (!course) throw new NotFoundException('Course not found');
    if (course.teacher.id !== teacherId)
      throw new ForbiddenException('You are not the owner of this course');

    Object.assign(course, dto);
    return this.CourseRepository.save(course);
}
  async deleteCourse(id: number, teacherId: number) {
    const course = await this.CourseRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });

    if (!course) throw new NotFoundException('Course not found');
    if (course.teacher.id !== teacherId)
      throw new ForbiddenException('You are not the owner of this course');

    return this.CourseRepository.remove(course);
  }

  async getAll() {
    return this.CourseRepository.find({
      relations: ['teacher'],
    });
  }

  async getOne(id: number) {
    return this.CourseRepository.findOne({
      where: { id },
      relations: ['teacher', 'enrollments','enrollments.student'
      ],
    });
  }
async enroll(courseId: number, studentId: number) {
    const student = await this.UserRepository.findOne({ where: { id: studentId } });

    if (!student || student.role !== 'student') {
      throw new ForbiddenException('Only students can enroll');
    }

    const course = await this.CourseRepository.findOne({
      where: { id: courseId },
      relations: ['enrollments'],
    });

    if (!course) throw new NotFoundException('Course not found');
    const existing = await this.enrollmentRepository.findOne({where:{student:{id:studentId}, course:{id:courseId}}})
    if(existing){ throw new BadRequestException('already enrolled')}
    const enrollment = this.enrollmentRepository.create({
      student,course,status:'ACTIVE'
    })
    return this.enrollmentRepository.save(enrollment)
  }
async getEnrolledCourses(studentId: number) {

  const student = await this.UserRepository.findOne({
    where: { id: studentId }
  });

  if (!student) throw new NotFoundException('Student not found');
  if (student.role !== 'student')
    throw new ForbiddenException('Only students can view enrolled courses');
const enrollments = await this.enrollmentRepository.find({
  where:{
    student:{id:studentId},
    status:'ACTIVE'
  },
  relations:['course','course.teacher']
})
return enrollments.map(e=> e.course)
 
}
}