import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Department, HighSchoolType, Level, Semester } from '../../../utils/enum';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ type: CreateUserDto, description: 'User information' })
  @ValidateNested()
  @Type(() => CreateUserDto)
  @IsNotEmptyObject()
  user: CreateUserDto;

  @ApiProperty({ example: '20230001', description: 'Student unique code' })
  @IsString()
  @IsNotEmpty()
  student_code: string;

  @ApiProperty({ enum: Department })
  @IsEnum(Department)
  @IsNotEmpty()
  department: Department;

  @ApiProperty({ enum: Level })
  @IsEnum(Level)
  @IsNotEmpty()
  level: Level;

  @ApiProperty({ enum: Semester })
  @IsEnum(Semester)
  @IsNotEmpty()
  semester: Semester;

  @ApiProperty({ example: 30, description: 'Completed credit hours' })
  @IsNumber()
  @IsNotEmpty()
  completed_credit_hours: number;

  @ApiProperty({ example: false, description: 'Indicates if the student has content access' })
  @IsBoolean()
  @IsNotEmpty()
  display_content: boolean;

  @ApiProperty({ example: 3.5, description: 'Current GPA' })
  @IsNumber()
  @IsNotEmpty()
  gpa: number;

  @ApiProperty({ example: 3.6, description: 'Cumulative GPA' })
  @IsNumber()
  @IsNotEmpty()
  cgpa: number;

  @ApiPropertyOptional({ example: '2023-09-01', description: 'Enrollment date' })
  @IsDateString()
  @IsOptional()
  enrollment_date: string;

  @ApiProperty({ enum: HighSchoolType })
  @IsEnum(HighSchoolType)
  @IsNotEmpty()
  high_school_type: HighSchoolType;

  @ApiProperty({ example: 95, description: 'High school score' })
  @IsNumber()
  @IsNotEmpty()
  high_school_score: number;

  @ApiProperty({ example: 410, description: 'High school total degree' })
  @IsNumber()
  @IsNotEmpty()
  high_school_degree: number;

  @ApiProperty({ example: 2022, description: 'High school graduation year' })
  @IsNumber()
  @IsNotEmpty()
  high_school_year: number;

  @ApiPropertyOptional({ example: 'Transfer student', description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes: string;
}
