// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Role } from 'src/common/enums/roles.enum';
// // import { Types } from 'mongoose';

import { Role } from "src/common/enums/roles.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// @Schema()
// export class User {
//   @Prop({ required: true })
//   name: string;
//   @Prop({ required: true, unique: true })
//   email: string;
//   @Prop({ required: true })
//   password: string;
//   @Prop()
//   refreshToken?: string;
//   @Prop({ type: [String], enum: Role, default: [Role.STUDENT] })
//   roles: Role[];
//   // @Prop({ index: true })
//   // tenantId: string;
// }

// export const UserSchema = SchemaFactory.createForClass(User);
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
}