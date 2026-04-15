import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InstructorCourse } from "./entities/assign-course.entity";
import { CoursesModule } from "src/courses/courses.module";
import { InstructorModule } from "src/instructors/instructor.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { AssignCourseController } from "./assign.controller";
import { AssignCourseService } from "./assign.service";

@Module({
    imports: [
        forwardRef(() => CoursesModule),
        forwardRef(() => InstructorModule),
        UsersModule,
        JwtModule,
        TypeOrmModule.forFeature([InstructorCourse]),
    ],
    controllers: [AssignCourseController],
    providers: [AssignCourseService],
    exports: [AssignCourseService],
})
export class AssignCourseModule { }