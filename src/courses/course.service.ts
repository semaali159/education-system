import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Course } from "./course.entity";
import { CreateCourseDto, UpdateCourseDto } from "./dtos/course.dto";
import { User } from "src/User/user.entity";

@Injectable()
export class CourseService{
    constructor(@InjectRepository(Course)private readonly CourseRepository:Repository<Course>,@InjectRepository(User)
    private readonly UserRepository: Repository<User>,){}
async create(dto:CreateCourseDto,teacherId:number){
const teacher = await this.UserRepository.findOne({ where: { id: teacherId } });

    if (!teacher || teacher.role !== 'teacher') {
      throw new ForbiddenException('Only teachers can create courses');
    }

    const course = this.CourseRepository.create({
      ...dto,
      teacher,
    });

    return this.CourseRepository.save(course);
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
      relations: ['teacher', 'students'],
    });
  }
async enroll(courseId: number, studentId: number) {
    const student = await this.UserRepository.findOne({ where: { id: studentId } });

    if (!student || student.role !== 'student') {
      throw new ForbiddenException('Only students can enroll');
    }

    const course = await this.CourseRepository.findOne({
      where: { id: courseId },
      relations: ['students'],
    });

    if (!course) throw new NotFoundException('Course not found');

    if (course.students.some((s) => s.id === studentId)) {
      throw new BadRequestException('You are already enrolled');
    }

    course.students.push(student);

    return this.CourseRepository.save(course);
  }
async getEnrolledCourses(studentId: number) {

  const student = await this.UserRepository.findOne({
    where: { id: studentId }
  });

  if (!student) throw new NotFoundException('Student not found');
  if (student.role !== 'student')
    throw new ForbiddenException('Only students can view enrolled courses');

  return this.CourseRepository.find({
    where: { students: { id: studentId } },
    relations: ['teacher'],
    order: { id: 'DESC' },
  });
}
}