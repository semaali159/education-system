import { CourseSession } from "src/course-sessions/entities/course-session.entity";
import { CourseSessionSchedule } from "src/course-sessions/entities/course-session-schedual";
import { User } from "src/User/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id:number
    
    @Column()
    title:string
    
    @Column({ nullable: true })
    description:string

    @Column({ type: 'int' })
  sessionsCount: number;

  @Column({ type: 'date' })
  startDate: Date;

    @ManyToMany(()=>User,(user)=> user.coursesEnrolled)
    @JoinTable({name:'course_students',joinColumn:{name:'courseId'},inverseJoinColumn:{name:'studenId'}})
students:User[]
@ManyToOne(()=>User, (user)=> user.coursesTaught,{eager:true})
teacher: User
@OneToMany(() => CourseSession, (session) => session.course, { cascade: true })
  sessions: CourseSession[];
  @OneToMany(() => CourseSessionSchedule, (s) => s.course, { cascade: true })
  schedules: CourseSessionSchedule[];
}