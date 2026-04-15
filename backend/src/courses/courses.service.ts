import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "./entities/course.entity";
import { Repository } from "typeorm";
import { UsersService } from "src/users/users.service";
import { CreateCourseDto } from "./dtos/create-course.dto";
import { Role } from "utils/enum";
import { UpdateCourseDto } from "./dtos/update-course.dto";
import { CoursePrerequisite } from "./entities/course-prerequisite.entity";
import { AddPrerequisiteDto } from "./dtos/add-prerequisite.dto";

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
        @InjectRepository(CoursePrerequisite)
        private readonly prerequisiteRepository: Repository<CoursePrerequisite>,
        private readonly usersService: UsersService,
    ) { }

    /**
     * Create a new course
     * @param createCourseDto 
     * @param instructor_id 
     * @param admin_id 
     * @returns {message: string, data: {course: Course}}
     */
    public async createCourse(dto: CreateCourseDto, adminId: string) {
        await this.usersService.checkValidation(adminId, Role.ADMIN);

        const existing = await this.courseRepository.findOne({
            where: { course_code: dto.course_code },
        });

        if (existing) {
            throw new BadRequestException('Course code already exists');
        }

        const course = this.courseRepository.create({
            course_code: dto.course_code,
            course_name: dto.course_name,
            course_description: dto.course_description,
            credit_hours: dto.course_credit_hours,
            level: dto.course_level,
            semester: dto.course_semester,
            department: dto.course_department,
        });

        return await this.courseRepository.save(course);
    }

    /**
     * Get all courses
     * @returns {message: string, data: {courses: Course[]}}
     */
    public async getAllCourses(): Promise<{ message: string, data: { courses: Course[] } }> {
        const courses = await this.courseRepository.find();
        return {
            message: 'Courses fetched successfully',
            data: {
                courses,
            },
        };
    }

    /**
     * Get course by id
     * @param course_id 
     * @returns {message: string, data: {course: Course}}
     */
    public async getCourse(courseId: string): Promise<{ message: string, data: { course: Course } }> {
        const course = await this.courseRepository.findOne({
            where: { id: courseId },
            relations: ['prerequisites', 'prerequisites.prerequisite'],
        });

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        return {
            message: 'Course fetched successfully',
            data: {
                course,
            },
        };
    }

    /**
     * Update course
     * @param id 
     * @param updateCourseDto 
     * @param admin_id 
     * @returns {message: string, data: {course: Course}}
     */
    public async updateCourse(
        course_id: string,
        updateCourseDto: UpdateCourseDto,
        admin_id: string,
    ): Promise<{ message: string, data: { course: Course } }> {
        await this.usersService.checkValidation(admin_id, Role.ADMIN);
        const course = await this.courseRepository.findOne({ where: { id: course_id } });
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        const updatedCourse = this.courseRepository.merge(course, updateCourseDto);
        return {
            message: 'Course updated successfully',
            data: {
                course: await this.courseRepository.save(updatedCourse),
            },
        };
    }

    /**
     * Delete course
     * @param course_id 
     * @param admin_id 
     * @returns {message: string}
     */
    public async deleteCourse(
        course_id: string,
        admin_id: string,
    ): Promise<{ message: string }> {
        await this.usersService.checkValidation(admin_id, Role.ADMIN);
        const course = await this.courseRepository.findOne({ where: { id: course_id } });
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        await this.courseRepository.remove(course);
        return {
            message: 'Course deleted successfully',
        };
    }

    /**
     * Add prerequisite to a course
     * There are some courses need prerequisites to be taken before them, so we need to add prerequisites to them
     * @param courseId 
     * @param prerequisiteId 
     * @param adminId 
     * @returns {message: string, data: {course: Course}}
     */
    public async addPrerequisite(
        courseId: string,
        addPrerequisiteDto: AddPrerequisiteDto,
        adminId: string,
    ) {
        await this.usersService.checkValidation(adminId, Role.ADMIN);

        if (courseId === addPrerequisiteDto.prerequisiteId) {
            throw new BadRequestException(
                'Course cannot depend on itself',
            );
        }

        const course = await this.courseRepository.findOne({
            where: { id: courseId },
        });

        const prerequisiteId = addPrerequisiteDto.prerequisiteId;

        const prerequisite = await this.courseRepository.findOne({
            where: { id: prerequisiteId },
        });

        if (!course || !prerequisite) {
            throw new NotFoundException('Course not found');
        }

        const existing = await this.prerequisiteRepository.findOne({
            where: {
                course: { id: courseId },
                prerequisite: { id: prerequisiteId },
            },
            relations: ['course', 'prerequisite'],
        });

        if (existing) {
            throw new BadRequestException('Prerequisite already exists');
        }

        const relation = this.prerequisiteRepository.create({
            course,
            prerequisite,
        });
        await this.prerequisiteRepository.save(relation);
        return {
            message: 'Prerequisite added successfully',
            data: {
                course: await this.courseRepository.findOne({
                    where: { id: courseId },
                    relations: ['prerequisites', 'prerequisites.prerequisite'],
                }),
            },
        };
    }

}