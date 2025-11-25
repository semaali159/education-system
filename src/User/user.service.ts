import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(
    email: string,
    password: string,
    username: string,
  ) {
const alreadyUser =await this.findByEmail(email)
if( alreadyUser)  throw new BadRequestException('user already exist');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      username,
    })
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where:{email} });
  }

  async findById(id: number) {
    return this.userRepository.findOne({where:{id}});
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    // const hashedToken = await bcrypt.hash(refreshToken, 10);
    const user=await this.findById(userId)
    if(!user)  throw new BadRequestException('user already exist');
   
  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await this.userRepository.save(user);
  }

  async removeRefreshToken(userId: number) {
        const user=await this.findById(userId)
    if(!user)  throw new BadRequestException('user already exist');
   user.refreshToken= undefined;
    await this.userRepository.save(user);
  }
}
