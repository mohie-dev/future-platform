import { Body, Controller, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { UpdateGradeDto } from "./dtos/update-grade.dto";
import { GradesService } from "./grades.service";
import { Semester } from "utils/enum";

@Controller('api/grades')
export class GradesController {
    constructor(
        private readonly gradesService: GradesService,
    ) {}

    @Post(':enrollmentId')
    @HttpCode(200)
    public async upsertGrade(
        @Param('enrollmentId') enrollmentId: string,
        @Body() dto: UpdateGradeDto,
    ) {
        return this.gradesService.upsertGrade(enrollmentId, dto);
    }

    @Patch(':enrollmentId')
    @HttpCode(200)
    public async updateGPA(
        @Param('enrollmentId') enrollmentId: string,
        @Body() dto: UpdateGradeDto,
    ) {
        return this.gradesService.upsertGrade(enrollmentId, dto);
    }

    @Patch(':enrollmentId/finalize')
    @HttpCode(200)
    public async finalizeGrade(
        @Param('enrollmentId') enrollmentId: string,
    ) {
        return this.gradesService.finalizeGrade(enrollmentId);
    }

    @Get('')
    @HttpCode(200)
    public async getGPA(
        // @Param('studentId') studentId: string,
    ) {
        return this.gradesService.calculateGPA('2fbcedf8-458f-4d47-9037-e8fcde0784be', 2026, 1);
    }

    @Get('cgpa')
    @HttpCode(200)
    public async getCGPA(
        // @Param('studentId') studentId: string,
    ) {
        return this.gradesService.calculateCGPA('2fbcedf8-458f-4d47-9037-e8fcde0784be');
    }
}