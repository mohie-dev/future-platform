import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Instructor } from "./entities/instructor.entity";
import { InstructorService } from "./instructor.service";
import { InstructorController } from "./instructor.controller";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { CoursesModule } from "src/courses/courses.module";
import { AssignCourseModule } from "src/assign-course/assign.module";

@Module({
    imports: [
        UsersModule,
        JwtModule,
        forwardRef(() => CoursesModule),
        forwardRef(() => AssignCourseModule),
        TypeOrmModule.forFeature([Instructor])
    ],
    controllers: [InstructorController],
    providers: [InstructorService],
    exports: [InstructorService],
})
export class InstructorModule { }