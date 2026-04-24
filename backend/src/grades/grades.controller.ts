import { Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { UpdateGradeDto } from "./dtos/update-grade.dto";
import { GradesService } from "./grades.service";

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
}