import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "./entities/course.entity";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";
import { CoursePrerequisite } from "./entities/course-prerequisite.entity";
import { AssignCourseModule } from "src/assign-course/assign.module";

@Module({
    imports: [
        UsersModule,
        JwtModule,
        forwardRef(() => AssignCourseModule),
        TypeOrmModule.forFeature([Course, CoursePrerequisite]),
    ],
    controllers: [CoursesController],
    providers: [CoursesService],
    exports: [CoursesService],
})
export class CoursesModule { }