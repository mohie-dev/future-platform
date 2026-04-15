import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional } from "class-validator";
import { CreditHours, Department, Level, Semester } from "utils/enum";

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    course_code: string;

    @IsString()
    @IsNotEmpty()
    course_name: string;

    @IsString()
    @IsNotEmpty()
    course_description: string;

    @IsEnum(CreditHours)
    @IsNotEmpty()
    course_credit_hours: CreditHours;

    @IsEnum(Semester)
    @IsNotEmpty()
    course_semester: Semester;

    @IsEnum(Department)
    @IsNotEmpty()
    course_department: Department;

    @IsEnum(Level)
    @IsNotEmpty()
    course_level: Level;

    @IsString()
    @IsOptional()
    prerequisite_course_ids: string[];
}