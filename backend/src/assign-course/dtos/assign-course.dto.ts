import { IsNotEmpty, IsString, IsInt, IsEnum } from 'class-validator';
import { Semester } from 'utils/enum';

export class AssignCourseDto {
  @IsString()
  @IsNotEmpty()
  instructor_id: string;

  @IsString()
  @IsNotEmpty()
  course_id: string;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsEnum(Semester)
  @IsNotEmpty()
  semester: Semester;
}