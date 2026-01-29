import { Expose } from "class-transformer";
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
