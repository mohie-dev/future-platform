import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Enrollment } from "./entities/enrollment.entity";
import { CoursesModule } from "src/courses/courses.module";
import { StudentsModule } from "src/students/students.module";
import { JwtModule } from "@nestjs/jwt";
import { EnrollmentService } from "./enrollments.service";
import { EnrollmentController } from "./enrollments.controller";
import { UsersModule } from "src/users/users.module";
import { GradesModule } from "src/grades/grades.module";

@Module({
    imports: [
        UsersModule,
        forwardRef(() => CoursesModule),
        forwardRef(() => StudentsModule),
        forwardRef(() => GradesModule),
        TypeOrmModule.forFeature([Enrollment]),
        JwtModule,
    ],
    controllers: [EnrollmentController],
    providers: [EnrollmentService],
    exports: [EnrollmentService],
})
export class EnrollmentsModule { }