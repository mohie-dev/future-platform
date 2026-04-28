import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { UpdateGradeDto } from "./dtos/update-grade.dto";
import { GradesService } from "./grades.service";
import { AuthRolesGuard } from "src/users/guards/auth-role.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { Role } from "utils/enum";

@Controller('api/grades')
export class GradesController {
    constructor(
        private readonly gradesService: GradesService,
    ) { }


    @Patch(':enrollmentId')
    @HttpCode(200)
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN, Role.INSTRUCTOR, Role.CONTROLL_MEMBER)
    public async updateGPA(
        @Param('enrollmentId') enrollmentId: string,
        @Body() dto: UpdateGradeDto,
    ) {
        return this.gradesService.upsertGrade(enrollmentId, dto);
    }

    @Patch(':enrollmentId/finalize')
    @HttpCode(200)
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN, Role.CONTROLL_MEMBER)
    public async finalizeGrade(
        @Param('enrollmentId') enrollmentId: string,
    ) {
        return this.gradesService.finalizeGrade(enrollmentId);
    }

    // GET: /api/grades?studentId=...&year=...&semester=...
    @Get('')
    @HttpCode(200)
    public async getGPA(
        @Query('studentId') studentId: string,
        @Query('year') year: number,
        @Query('semester') semester: number,
    ) {
        return this.gradesService.calculateGPA(studentId, year, semester);
    }

    // GET: /api/grades/cgpa?studentId=...
    @Get('cgpa')
    @HttpCode(200)
    public async getCGPA(
        @Query('studentId') studentId: string,
    ) {
        return this.gradesService.calculateCGPA(studentId);
    }
}