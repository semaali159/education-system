import { Controller, Post, Body, Param } from '@nestjs/common';
import { ProfilesService } from './profile.service';
@Controller('profiles')
export class ProfilesController {
constructor(private profilesService: ProfilesService) {}
@Post('student/:userId')
createStudent(
@Param('userId') userId: string,
@Body() body: { gradeLevel?: string },
) {
return this.profilesService.createStudentProfile(+userId, body.gradeLevel);
}
@Post('teacher/:userId')
createTeacher(
@Param('userId') userId: string,
@Body() body: { specialty?: string },
) {
return this.profilesService.createTeacherProfile(+userId, body.specialty);
}
}