import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProfile } from './entities/student-profile.entity';
import { TeacherProfile } from './entities/teacher-profile';
import { User } from '../User/user.entity';
@Injectable()
export class ProfilesService {
constructor(
@InjectRepository(StudentProfile) private studentRepo:
Repository<StudentProfile>,
@InjectRepository(TeacherProfile) private teacherRepo:
Repository<TeacherProfile>,
@InjectRepository(User) private usersRepo: Repository<User>,
) {}
async createStudentProfile(userId: number, gradeLevel?: string) {
const user = await this.usersRepo.findOne({ where: { id: userId } });
if(!user)  throw new NotFoundException()
const profile = this.studentRepo.create({ user: { id: user.id }, gradeLevel });
return this.studentRepo.save(profile);
}
async createTeacherProfile(userId: number, specialty?: string) {
const user = await this.usersRepo.findOne({ where: { id: userId } });
if(!user)  throw new NotFoundException()
const profile = this.teacherRepo.create({  user: { id: user.id }, specialty });
return this.teacherRepo.save(profile);
}
}
