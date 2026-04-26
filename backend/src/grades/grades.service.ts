import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Grade } from "./entities/grade.entity";
import { Grade as GradeEnum } from "../../utils/enum";
import { Repository } from "typeorm";
import { UpdateGradeDto } from "./dtos/update-grade.dto";
import { Enrollment } from "src/enrollments/entities/enrollment.entity";
import { StudentsService } from "src/students/students.service";

@Injectable()
export class GradesService {
    constructor(
        @InjectRepository(Grade)
        private gradeRepository: Repository<Grade>,
        @InjectRepository(Enrollment)
        private enrollmentRepository: Repository<Enrollment>,
        private readonly studentService: StudentsService,
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

        // calculate letter
        grade.grade = this.calculateLetter(grade.total);

        // calculate point
        grade.point = this.getGradePoint(grade.grade);

        return this.gradeRepository.save(grade);
    }

    /**
     * Calculate GPA for a student in a specific year and semester
     * @param student_id - Student ID
     * @param year - Year
     * @param semester - Semester
     * @returns GPA
     */
    public async calculateGPA(student_id: string, year: number, semester: number) {
        const enrollments = await this.enrollmentRepository.find({
            where: { student: { id: student_id }, year, semester },
            relations: ['grade', 'course'],
        });

        let total_points = 0;
        let total_credits = 0;

        console.log("total enrollment: ", enrollments.length);

        for (const enrollment of enrollments) {
            if (enrollment.grade?.is_finalized) {
                console.log("Finalized grade: ", enrollment.grade);
                total_points += enrollment.grade.point * enrollment.course.credit_hours;
                total_credits += enrollment.course.credit_hours;
            }
        }

        const gpa = total_points / total_credits;

        await this.studentService.updateStudent(student_id, { gpa });

        return gpa;
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

    private getGradePoint(grade: GradeEnum): number {
        switch (grade) {
            case GradeEnum.A_PLUS:
                return 4.0;
            case GradeEnum.A:
                return 3.75;
            case GradeEnum.A_MINUS:
                return 3.5;
            case GradeEnum.B_PLUS:
                return 3.25;
            case GradeEnum.B:
                return 3.0;
            case GradeEnum.B_MINUS:
                return 2.75;
            case GradeEnum.C_PLUS:
                return 2.5;
            case GradeEnum.C:
                return 2.25;
            case GradeEnum.C_MINUS:
                return 2.0;
            case GradeEnum.D_PLUS:
                return 1.75;
            case GradeEnum.D:
                return 1.5;
            case GradeEnum.D_MINUS:
                return 1.25;
            default:
                return 0.0;
        }
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