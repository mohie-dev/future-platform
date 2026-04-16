import { Controller, Post, Body, UseGuards, Get, Param, Put, Delete } from "@nestjs/common";
import { EnrollmentService } from "./enrollments.service";
import { CreateEnrollmentDto } from "./dtos/create-enrollment.dto";
import { AuthRolesGuard } from "src/users/guards/auth-role.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { Role } from "utils/enum";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import * as type from "utils/type";
import { UpdateEnrollmentDto } from "./dtos/update-enrollment.dto";

@Controller('api/enrollments')
export class EnrollmentController {
    constructor(
        private readonly enrollmentService: EnrollmentService,
    ) { }

    // POST: ~/api/enrollments
    @Post()
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    async createEnrollment(
        @Body() createEnrollmentDto: CreateEnrollmentDto,
        @CurrentUser() user: type.JWTPayloadType
    ) {
        return this.enrollmentService.createEnrollment(createEnrollmentDto, user.sub);
    }

    // GET: ~/api/enrollments/:id
    @Get(':id')
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    async getEnrollmentById(@Param('id') id: string) {
        return this.enrollmentService.getEnrollmentById(id);
    }

    // GET: ~/api/enrollments/student/:student_id
    @Get('student/:student_id')
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    async getStudentEnrollments(@Param('student_id') student_id: string) {
        return this.enrollmentService.getStudentEnrollments(student_id);
    }

    // GET: ~/api/enrollments/course/:course_id
    @Get('course/:course_id')
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    async getCourseEnrollments(@Param('course_id') course_id: string) {
        return this.enrollmentService.getCourseEnrollments(course_id);
    }

    // PUT: ~/api/enrollments/:id
    @Put(':id')
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    async updateEnrollmentStatus(@Param('id') id: string, @Body() dto: UpdateEnrollmentDto, @CurrentUser() user: type.JWTPayloadType) {
        return this.enrollmentService.updateEnrollmentStatus(id, dto.status, user.sub);
    }

    // DELETE: ~/api/enrollments/:id
    @Delete(':id')
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    async deleteEnrollment(@Param('id') id: string, @CurrentUser() user: type.JWTPayloadType) {
        return this.enrollmentService.deleteEnrollment(id, user.sub);
    }
}