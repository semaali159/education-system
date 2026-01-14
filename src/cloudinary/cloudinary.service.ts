import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File) {
  console.log("DDDDDDdddd")
    try {
    return await cloudinary.uploader.upload(file.path, {
  folder: 'lms',
  resource_type: 'auto',
});
    } catch (error) {
      throw new InternalServerErrorException('Cloudinary upload failed');
    }
  }
}
