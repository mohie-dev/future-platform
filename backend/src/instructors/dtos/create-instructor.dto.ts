import { IsEnum, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Department } from "utils/enum";
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

    @IsEnum(Department)
    @IsNotEmpty()
    department: Department;

    @IsString()
    @IsOptional()
    notes: string;
}