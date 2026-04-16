import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Enrollment } from "./entities/enrollment.entity";
import { Repository, In } from "typeorm";
import { Semester, EnrollmentStatus, Role } from "utils/enum";
import { CoursesService } from "src/courses/courses.service";
import { StudentsService } from "src/students/students.service";
import { Student } from "src/students/entities/student.entity";
import { CreateEnrollmentDto } from "./dtos/create-enrollment.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class EnrollmentService {
    constructor(
        @InjectRepository(Enrollment)
        private readonly enrollmentRepository: Repository<Enrollment>,
        private readonly studentService: StudentsService,
        private readonly courseService: CoursesService,
    ) { }

    public async createEnrollment(dto: CreateEnrollmentDto, admin_id: string) {
        const { studentId, courseId, year, semester } = dto;

        const student = await this.studentService.getStudentById(studentId);
        const course = await this.courseService.getCourse(courseId);

        const completedCourses = await this.studentService.getStudentCompletedCourses(studentId);

        // check if student has met the minimum credit hours requirement
        if (course.data.course.credit_hours <= student.completed_credit_hours) {
            throw new BadRequestException('Student has not met the minimum credit hours requirement');
        }

        // check if student has met the prerequisite requirement
        if (course.data.course.prerequisites.length > 0) {
            for (const prerequisite of course.data.course.prerequisites) {
                if (!completedCourses.includes(prerequisite.prerequisite)) {
                    throw new BadRequestException('Student has not met the prerequisite requirement');
                }
            }
        }

        // check if student is already enrolled in the course
        const existingEnrollment = await this.enrollmentRepository.findOne({
            where: {
                student: student,
                course: course.data.course,
                year: year,
                semester: semester,
            },
        });

        if (existingEnrollment) {
            throw new BadRequestException('Student is already enrolled in the course');
        }

        // check if student gpa is meet the minimum gpa requirement
        if (student.gpa < course.data.course.min_gpa) {
            throw new BadRequestException('Student has not met the minimum gpa requirement');
        }

        const enrollment = this.enrollmentRepository.create({
            student: student,
            course: course.data.course,
            year: year,
            semester: semester,
            status: EnrollmentStatus.IN_PROGRESS,
        });

        return {
            message: 'Enrollment created successfully',
            data: {
                enrollment: await this.enrollmentRepository.save(enrollment),
            },
        };
    }

}