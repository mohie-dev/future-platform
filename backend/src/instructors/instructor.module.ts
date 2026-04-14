import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Instructor } from "./entities/instructor.entity";
import { InstructorService } from "./instructor.service";
import { InstructorController } from "./instructor.controller";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        UsersModule,
        JwtModule,
        TypeOrmModule.forFeature([Instructor])
    ],
    controllers: [InstructorController],
    providers: [InstructorService],
})
export class InstructorModule { }