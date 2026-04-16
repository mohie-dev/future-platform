import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Enrollment } from "./entities/enrollment.entity";
import { Repository, In } from "typeorm";
import { EnrollmentStatus, Role } from "utils/enum";
import { CoursesService } from "src/courses/courses.service";
import { StudentsService } from "src/students/students.service";
import { CreateEnrollmentDto } from "./dtos/create-enrollment.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class EnrollmentService {
    constructor(
        @InjectRepository(Enrollment)
        private readonly enrollmentRepository: Repository<Enrollment>,
        private readonly studentService: StudentsService,
        private readonly courseService: CoursesService,
        private readonly usersService: UsersService,
    ) { }

    /**
     * Create a new enrollment
     * @param dto - Enrollment data
     * @param admin_id - Admin ID
     * @returns Enrollment created successfully
     */
    public async createEnrollment(dto: CreateEnrollmentDto, admin_id: string) {
        await this.usersService.checkValidation(admin_id, Role.ADMIN);
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


    /**
     * Get all enrollments
     * @param admin_id - Admin ID
     * @returns All enrollments
     */
    public async getAllEnrollments(admin_id: string) {
        await this.usersService.checkValidation(admin_id, Role.ADMIN);
        const enrollments = await this.enrollmentRepository.find({
            relations: ['student', 'course'],
        });

        return {
            message: 'Enrollments fetched successfully',
            data: {
                enrollments,
            },
        };
    }

    /**
     * Get enrollment by ID
     * @param id - Enrollment ID
     * @returns Enrollment by ID
     */
    public async getEnrollmentById(id: string) {
        const enrollment = await this.enrollmentRepository.findOne({
            where: { id },
            relations: ['student', 'course'],
        });

        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }

        return {
            message: 'Enrollment fetched successfully',
            data: {
                enrollment,
            },
        };
    }

    /**
     * Get student enrollments
     * @param student_id - Student ID
     * @returns Student enrollments
     */
    public async getStudentEnrollments(student_id: string) {
        const enrollments = await this.enrollmentRepository.find({
            where: { student: { id: student_id } },
            relations: ['course'],
        });

        return {
            message: 'Student enrollments fetched successfully',
            data: {
                enrollments,
            },
        };
    }

    /**
     * Update enrollment status
     * @param id - Enrollment ID
     * @param status - Enrollment status
     * @returns Enrollment updated successfully
     */
    public async updateEnrollmentStatus(id: string, status: EnrollmentStatus, admin_id: string) {
        await this.usersService.checkValidation(admin_id, Role.ADMIN);
        const enrollment = await this.enrollmentRepository.findOne({
            where: { id },
        });

        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }

        enrollment.status = status;
        return {
            message: 'Enrollment updated successfully',
            data: {
                enrollment: await this.enrollmentRepository.save(enrollment),
            },
        };
    }

    /**
     * Delete enrollment
     * @param id - Enrollment ID
     * @param admin_id - Admin ID
     * @returns Enrollment deleted successfully
     */
    public async deleteEnrollment(id: string, admin_id: string) {
        await this.usersService.checkValidation(admin_id, Role.ADMIN);
        const enrollment = await this.enrollmentRepository.findOne({
            where: { id },
        });

        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }

        await this.enrollmentRepository.remove(enrollment);
        return {
            message: 'Enrollment deleted successfully',
        };
    }

    /**
     * Get course enrollments (All students enrolled in a course)
     * @param course_id - Course ID
     * @returns Course enrollments
     */
    public async getCourseEnrollments(course_id: string) {
        const enrollments = await this.enrollmentRepository.find({
            where: { course: { id: course_id } },
            relations: ['student'],
        });

        return {
            message: 'Course enrollments fetched successfully',
            data: {
                enrollments,
            },
        };
    }
}