import { IsEnum, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Department, InstructorDegree, InstructorRank } from "utils/enum";
import { CreateUserDto } from "src/users/dtos/create-user.dto";
import { Type } from "class-transformer";

export class CreateInstructorDto {
    @ValidateNested()
    @Type(() => CreateUserDto)
    @IsNotEmptyObject()
    user: CreateUserDto;

    @IsString()
    @IsNotEmpty()
    instructor_code: string;

    @IsEnum(InstructorRank)
    @IsNotEmpty()
    instructor_rank: InstructorRank;

    @IsEnum(Department)
    @IsNotEmpty()
    department: Department;

    @IsEnum(InstructorDegree)
    @IsNotEmpty()
    instructor_degree: InstructorDegree;

    @IsString()
    @IsOptional()
    notes: string;
}