import { IsEnum, IsOptional, IsString, IsNumber } from "class-validator";
import { Department, CreditHours, Semester, Level } from "utils/enum";

export class UpdateCourseDto {
    @IsString()
    @IsOptional()
    course_code: string;

    @IsString()
    @IsOptional()
    course_name: string;

    @IsString()
    @IsOptional()
    course_description: string;

    @IsEnum(CreditHours)
    @IsOptional()
    course_credit_hours: CreditHours;

    @IsEnum(Semester)
    @IsOptional()
    course_semester: Semester;

    @IsEnum(Department)
    @IsOptional()
    course_department: Department;

    @IsEnum(Level)
    @IsOptional()
    course_level: Level;

    @IsNumber()
    @IsOptional()
    course_min_credit_hours?: number;

    @IsNumber()
    @IsOptional()
    course_min_gpa?: number;
}