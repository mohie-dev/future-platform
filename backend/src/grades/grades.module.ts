import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from './entities/grade.entity';
import { GradesController } from './grades.controller';
import { GradesService } from './grades.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';

@Module({
    imports: [
        UsersModule,
        JwtModule,
        TypeOrmModule.forFeature([Grade, Enrollment]),
    ],
    controllers: [GradesController],
    providers: [GradesService],
    exports: [GradesService],
})
export class GradesModule { }