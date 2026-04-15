import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Department, CreditHours, Semester } from "utils/enum";

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

    @IsString()
    @IsOptional()
    instructor_id: string;
}