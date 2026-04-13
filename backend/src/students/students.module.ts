import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { UsersModule } from "src/users/users.module";
import { StudentsService } from "./students.service";
import { Student } from "./entities/student.entity";
import { StudentsController } from "./students.controller";

@Module({
    imports: [UsersModule, JwtModule, TypeOrmModule.forFeature([User, Student])],
    providers: [StudentsService],
    controllers: [StudentsController],
    exports: [StudentsService, TypeOrmModule],
})
export class StudentsModule {}