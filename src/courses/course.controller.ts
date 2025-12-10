import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CourseService } from './course.service';

import type { JwtPayload } from '../common/types/payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { CreateCourseDto, UpdateCourseDto } from './dtos/course.dto';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Create a new course (Teacher only)' })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({ status: 201, description: 'Course successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden – only teacher allowed' })
  createCourse(
    @GetUser() teacher: JwtPayload,
    @Body() dto: CreateCourseDto,
  ) {
    return this.courseService.create(dto, teacher.userId);
  }

  @Put(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Update an existing course (Teacher only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  updateCourse(
    @Param('id') courseId: number,
    @GetUser() teacher: JwtPayload,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.update(courseId, dto, teacher.userId);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Delete a course (Teacher only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Course deleted' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  deleteCourse(
    @Param('id') courseId: number,
    @GetUser() teacher: JwtPayload,
  ) {
    return this.courseService.deleteCourse(courseId, teacher.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses (Public)' })
  @ApiResponse({ status: 200, description: 'List of all courses returned' })
  getAllCourses() {
    return this.courseService.getAll();
  }

  @Post(':id/enroll')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Enroll in a course (Student only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Student enrolled successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  enroll(
    @Param('id') courseId: number,
    @GetUser() student: JwtPayload,
  ) {
    return this.courseService.enroll(courseId, student.userId);
  }
  @Get('my/enrolled')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
getMyEnrolledCourses(
    @GetUser() student: JwtPayload) {
  return this.courseService.getEnrolledCourses(student.userId);
}

}
