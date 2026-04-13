import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Department, HighSchoolType, Level, Semester } from 'utils/enum';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  @IsNotEmptyObject()
  user: CreateUserDto;

  @IsString()
  @IsNotEmpty()
  student_code: string;

  @IsEnum(Department)
  @IsNotEmpty()
  department: Department;

  @IsEnum(Level)
  @IsNotEmpty()
  level: Level;

  @IsEnum(Semester)
  @IsNotEmpty()
  semester: Semester;

  @IsNumber()
  @IsNotEmpty()
  completed_credit_hours: number;

  @IsNumber()
  @IsNotEmpty()
  gpa: number;

  @IsDateString()
  @IsOptional()
  enrollment_date: string;

  @IsEnum(HighSchoolType)
  @IsNotEmpty()
  high_school_type: HighSchoolType;

  @IsNumber()
  @IsNotEmpty()
  high_school_score: number;

  @IsNumber()
  @IsNotEmpty()
  high_school_degree: number;

  @IsNumber()
  @IsNotEmpty()
  high_school_year: number;
}
