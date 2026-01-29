import { CourseSession } from "src/course-sessions/entities/course-session.entity";
import { CourseSessionSchedule } from "src/course-sessions/entities/course-session-schedual";
import { User } from "src/User/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Assignment } from "src/assignment/assignment.entity";
import { Enrollment } from "src/Enrollments/Enrollment.entity";
@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int' })
  sessionsCount: number;

  @Column({ type: 'date' })
  startDate: Date;

  @ManyToOne(() => User, user => user.coursesTaught, { eager: true })
  teacher: User;

  @OneToMany(() => CourseSession, s => s.course, { cascade: true })
  sessions: CourseSession[];

  @OneToMany(() => CourseSessionSchedule, s => s.course, { cascade: true })
  schedules: CourseSessionSchedule[];

  @OneToMany(() => Assignment, a => a.course)
  assignments: Assignment[];

  @OneToMany(() => Enrollment, e => e.course)
  enrollments: Enrollment[];
}
