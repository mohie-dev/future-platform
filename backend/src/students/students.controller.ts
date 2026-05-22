import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../users/guards/auth.guard';
import { CreateStudentDto } from './dtos/create-student.dto';
import { StudentsService } from './students.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import * as type from '../../utils/type';
import { AuthRolesGuard } from '../users/guards/auth-role.guard';
import { Roles } from '../users/decorators/user-role.decorator';
import { Department, Gender, Level, Role } from '../../utils/enum';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateStudentDto } from './dtos/update-student.dto';

@ApiTags('Students')
@Controller('api/students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
  ) { }

  // GET ~/api/students/count
  @Get('count')
  @ApiOperation({ summary: 'Get total number of students' })
  async getNumberOfStudents() {
    return this.studentsService.getNumberOfStudents();
  }

  // POST ~/api/students/create
  @Post('create')
  @UseGuards(AuthRolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new student (Admin only)' })
  @ApiResponse({ status: 201, description: 'Student successfully created' })
  public async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.createStudent(createStudentDto);
  }

  // GET ~/api/students?level=Level&department=Department&gender=Gender
  @Get()
  @ApiOperation({ summary: 'Get all students with optional filters' })
  @ApiQuery({ name: 'level', enum: Level, required: false })
  @ApiQuery({ name: 'department', enum: Department, required: false })
  @ApiQuery({ name: 'gender', enum: Gender, required: false })
  async getAllStudents(
    @Query('level') level?: Level,
    @Query('department') department?: Department,
    @Query('gender') gender?: Gender
  ) {
    return this.studentsService.getAllStudents(level, department, gender);
  }

  // GET ~/api/students/dashboard
  @Get('dashboard')
  @UseGuards(AuthRolesGuard)
  @Roles(Role.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current student dashboard data' })
  async studentDashboard(@CurrentUser() payload: type.JWTPayloadType) {
    return this.studentsService.studentDashboard(payload.sub);
  }

  // GET ~/api/students/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  async getStudentById(@Param('id') id: string) {
    return this.studentsService.getStudentById(id);
  }

  // GET ~/api/students/dashboard/gpa
  @Get('dashboard/gpa')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current student GPA and CGPA' })
  async getStudentGPAandCGPA(@CurrentUser() payload: type.JWTPayloadType) {
    return this.studentsService.getStudentGPAandCGPA(payload.sub);
  }

  //  GET ~/api/students/code/:student_code
  @Get('code/:student_code')
  @ApiOperation({ summary: 'Get student by student code' })
  async getStudentByCode(@Param('student_code') student_code: string) {
    return this.studentsService.getStudentByCode(student_code);
  }

  // PUT ~/api/students/:id
  @Put(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update student (Admin only)' })
  @ApiResponse({ status: 201, description: 'Student successfully updated' })
  public async updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.updateStudent(id, updateStudentDto);
  }

  // DELETE ~/api/students/:id
  @Delete(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete student (Admin only)' })
  @ApiResponse({ status: 201, description: 'Student successfully deleted' })
  public async deleteStudent(
    @Param('id') id: string,
  ) {
    return this.studentsService.deleteStudent(id);
  }

  // PUT ~/api/students/:id/toggle-content
  @Put(':id/toggle-content')
  @UseGuards(AuthRolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle student content access (Admin only) for display content for the student' })
  async toggleContentAccess(@Param('id') id: string) {
    return this.studentsService.toggleContentAccess(id);
  }
}
