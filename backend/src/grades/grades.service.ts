import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Grade } from "./entities/grade.entity";
import { Grade as GradeEnum } from "../../utils/enum";
import { Repository } from "typeorm";
import { UpdateGradeDto } from "./dtos/update-grade.dto";
import { Enrollment } from "src/enrollments/entities/enrollment.entity";

@Injectable()
export class GradesService {
    constructor(
        @InjectRepository(Grade)
        private gradeRepository: Repository<Grade>,
        @InjectRepository(Enrollment)
        private enrollmentRepository: Repository<Enrollment>,
    ) { }


    /**
     * upsert grade if not found create it then save it
     * @param enrollmentId 
     * @param dto 
     * @returns 
     */
    public async upsertGrade(
        enrollmentId: string,
        dto: UpdateGradeDto,
    ) {
        const enrollment = await this.enrollmentRepository.findOne({
            where: { id: enrollmentId },
            relations: ['course', 'student'],
        });

        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }

        let grade = await this.gradeRepository.findOne({
            where: { enrollment: { id: enrollmentId } },
            relations: ['enrollment'],
        });

        // If grade not found, create it. Usually happens when student enrolls in a course for the first time.
        if (!grade) {
            grade = this.gradeRepository.create({
                enrollment,
                coursework: 0,
                midterm: 0,
                final: 0,
            });
        }

        // prevent edit after finalize
        if (grade.is_finalized) {
            throw new BadRequestException('Grade already finalized');
        }

        // assign values
        grade.coursework = dto.coursework ?? grade.coursework;
        grade.midterm = dto.midterm ?? grade.midterm;
        grade.final = dto.final ?? grade.final;

        // validation
        this.validateMarks(grade);

        // calculate total
        grade.total =
            (grade.coursework || 0) +
            (grade.midterm || 0) +
            (grade.final || 0);

        return this.gradeRepository.save(grade);
    }

    // Finalize grade check and save
    public async finalizeGrade(enrollmentId: string) {
        const grade = await this.gradeRepository.findOne({
            where: { enrollment: { id: enrollmentId } },
        });

        if (!grade) {
            throw new NotFoundException('Grade not found');
        }

        if (grade.is_finalized) {
            throw new BadRequestException('Already finalized');
        }

        // calculate letter
        grade.grade = this.calculateLetter(grade.total);

        grade.is_finalized = true;

        return this.gradeRepository.save(grade);
    }

    // Generate Letter Grade based on total score
    private calculateLetter(total: number): GradeEnum {
        if (total >= 96) return GradeEnum.A_PLUS;
        if (total >= 92) return GradeEnum.A;
        if (total >= 88) return GradeEnum.A_MINUS;
        if (total >= 84) return GradeEnum.B_PLUS;
        if (total >= 80) return GradeEnum.B;
        if (total >= 76) return GradeEnum.B_MINUS;
        if (total >= 72) return GradeEnum.C_PLUS;
        if (total >= 68) return GradeEnum.C;
        if (total >= 64) return GradeEnum.C_MINUS;
        if (total >= 60) return GradeEnum.D_PLUS;
        if (total >= 55) return GradeEnum.D;
        if (total >= 50) return GradeEnum.D_MINUS;

        return GradeEnum.F;
    }

    /**
     * Validate marks
     * @param grade - Grade entity
     */
    private validateMarks(grade: Grade): void {
        if (grade.coursework < 0 || grade.coursework > 100) {
            throw new BadRequestException('Coursework must be between 0 and 100');
        }

        if (grade.midterm < 0 || grade.midterm > 100) {
            throw new BadRequestException('Midterm must be between 0 and 100');
        }

        if (grade.final < 0 || grade.final > 100) {
            throw new BadRequestException('Final must be between 0 and 100');
        }
    }
}