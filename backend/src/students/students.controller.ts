import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CreateStudentDto } from './dtos/create-student.dto';
import { StudentsService } from './students.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import * as type from 'utils/type';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { Role } from 'utils/enum';

@Controller('api/students')
@UseGuards(AuthGuard)
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
  ) {}

  // POST: ~/api/students/create
  @Post('create')
  @UseGuards(AuthRolesGuard)
  @Roles(Role.ADMIN)
  public async createStudent(
    @Body() createStudentDto: CreateStudentDto,
    @CurrentUser() user: type.JWTPayloadType,
  ) {
    return this.studentsService.createStudent(createStudentDto, user.sub);
  }
}
