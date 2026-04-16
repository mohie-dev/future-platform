import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { StudentsModule } from './students/students.module';
import { InstructorModule } from './instructors/instructor.module';
import { CoursesModule } from './courses/courses.module';
import { AssignCourseModule } from './assign-course/assign.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [
    UsersModule,
    StudentsModule,
    InstructorModule,
    CoursesModule,
    AssignCourseModule,
    EnrollmentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 5,
    }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule { }
