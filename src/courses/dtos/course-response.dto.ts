import { Exclude, Expose, plainToInstance, Transform, Type } from "class-transformer";
import { teacherResponeDto } from "src/User/dtos/response/teacher.dto";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
export class createCourseResponseDto {
    @Expose()
  id: number;
  @Expose()
  title: string;
@Expose()
  description: string;
@Expose()
  sessionsCount: number;
@Expose()
  startDate: Date;
  @Expose()
  teacherId:string
}

export class enrollCourseResponseDto{
    @Expose()
    id: number;
  
    @Expose()
    status: 'ACTIVE' | 'PENDING' | 'DROPPED';
  
    @Expose()
    enrolledAt: Date;

    @Expose()
    courseName:string

    @Expose()
    @Transform(({obj})=>{plainToInstance(teacherResponeDto,obj.user)})
    @Type(()=>teacherResponeDto)
    teacherId:teacherResponeDto
    @Exclude()
@Transform(({obj})=>{plainToInstance(createCourseResponseDto,obj.course)})
    @Type(()=>teacherResponeDto)
    course:teacherResponeDto
}