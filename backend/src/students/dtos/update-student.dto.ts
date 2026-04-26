import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Semester } from "utils/enum";

export class UpdateStudentDto {
    @IsNumber()
    @IsOptional()
    cgpa?: number;

    @IsNumber()
    @IsOptional()
    gpa?: number;

    @IsNumber()
    @IsOptional()
    year?: number;

    @IsEnum(Semester)
    @IsOptional()
    semester?: Semester;
}