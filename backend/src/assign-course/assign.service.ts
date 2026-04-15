import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InstructorCourse } from "./entities/assign-course.entity";
import { Repository } from "typeorm";
import { Role } from "utils/enum";
import { UsersService } from "src/users/users.service";
import { AssignCourseDto } from "./dtos/assign-course.dto";
import { InstructorService } from "src/instructors/instructor.service";
import { CoursesService } from "src/courses/courses.service";

@Injectable()
export class AssignCourseService {
    constructor(
        @InjectRepository(InstructorCourse)
        private readonly instructorCourseRepository: Repository<InstructorCourse>,
        private readonly usersService: UsersService,
        private readonly instructorService: InstructorService,
        private readonly coursesService: CoursesService,
    ) { }

    public async assignCourse(dto: AssignCourseDto, adminId: string) {
        await this.usersService.checkValidation(adminId, Role.ADMIN);
        await this.instructorService.getInstructorById(dto.instructor_id);
        await this.coursesService.getCourse(dto.course_id);

        const existing = await this.instructorCourseRepository.findOne({
            where: {
                instructor: { id: dto.instructor_id },
                course: { id: dto.course_id },
                year: dto.year,
                semester: dto.semester,
            },
        });

        if (existing) {
            throw new BadRequestException('Course already assigned to this instructor');
        }

        const instructorCourse = this.instructorCourseRepository.create({
            instructor: { id: dto.instructor_id },
            course: { id: dto.course_id },
            year: dto.year,
            semester: dto.semester,
        });

        return await this.instructorCourseRepository.save(instructorCourse);
    }
}