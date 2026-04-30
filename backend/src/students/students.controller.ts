import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CreateStudentDto } from './dtos/create-student.dto';
import { StudentsService } from './students.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import * as type from 'utils/type';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { Department, Gender, Level, Role } from 'utils/enum';

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

  // GET: ~/api/students
  @Get()
  async getAllStudents(
    @Query('level') level?: Level,
    @Query('department') department?: Department,
    @Query('gender') gender?: Gender
  ) {
    return this.studentsService.getAllStudents(level, department, gender);
  }

  // GET: ~/api/students/:id
  // @Get(':id')
  // async getStudentById(@Param('id') id: string) {
  //   return this.studentsService.getStudentById(id);
  // }

  // GET: ~/api/students/code/:student_code
  @Get('code/:student_code')
  async getStudentByCode(@Param('student_code') student_code: string) {
    return this.studentsService.getStudentByCode(student_code);
  }

  // GET: ~/api/students/dashboard
  @Get('dashboard')
  @UseGuards(AuthRolesGuard)
  @Roles(Role.STUDENT)
  async studentDashboard(@CurrentUser() payload: type.JWTPayloadType) {
    return this.studentsService.studentDashboard(payload.sub);
  }
}
