import { Course } from "src/courses/course.entity";
import { StudentProfile } from "../profiles/entities/student-profile.entity";
import { TeacherProfile } from "../profiles/entities/teacher-profile.entity";
import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "src/common/enums/roles.enum";
@Entity({"name":"users"})
export class User{
  @PrimaryGeneratedColumn()
  id:number
  @Column({type:"varchar",length:'150',unique:true})
email:string
@Column()
password:string
@Column({type:"varchar",length:'150',nullable:true})
username:string
@Column({type:'enum',enum:Role, default:Role.STUDENT})
role:Role
@Column({default:false})
isAccountVerified:boolean
@Column({type: 'text',nullable:true})
  refreshToken?: string;
@Column({default:false})
isAdmin:boolean  
@OneToOne(() => StudentProfile, (profile) => profile.user, { nullable: true })
studentProfile?: StudentProfile;
@OneToOne(() => TeacherProfile, (profile) => profile.user, { nullable: true })
teacherProfile?: TeacherProfile;  
@OneToMany(()=> Course, (course)=> course.teacher)
coursesTaught:Course[]
@ManyToMany(()=>Course, (course)=> course.students)
coursesEnrolled:Course[]
}