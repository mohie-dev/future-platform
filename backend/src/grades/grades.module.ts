import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from './entities/grade.entity';
import { GradesController } from './grades.controller';
import { GradesService } from './grades.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { StudentsModule } from 'src/students/students.module';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';

@Module({
    imports: [
        UsersModule,
        JwtModule,
        forwardRef(() => StudentsModule),
        forwardRef(() => EnrollmentsModule),
        TypeOrmModule.forFeature([Grade, Enrollment]),
    ],
    controllers: [GradesController],
    providers: [GradesService],
    exports: [GradesService],
})
export class GradesModule { }