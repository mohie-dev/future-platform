import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmptyObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { Department, InstructorDegree, InstructorRank } from 'utils/enum';

export class UpdateInstructorDto {
    @ApiProperty({ type: UpdateUserDto, description: 'User information' })
    @ValidateNested()
    @Type(() => UpdateUserDto)
    @IsNotEmptyObject()
    user: UpdateUserDto;

    @ApiProperty({ example: 'INS001', description: 'Instructor unique code' })
    @IsString()
    @IsOptional()
    instructor_code?: string;

    @ApiProperty({ example: 'Senior Instructor', description: 'Instructor rank' })
    @IsEnum(InstructorRank)
    @IsOptional()
    instructor_rank?: InstructorRank;

    @ApiProperty({ enum: Department, example: 'Computer Science', description: 'Instructor department' })
    @IsEnum(Department)
    @IsOptional()
    department?: Department;

    @ApiProperty({ enum: InstructorDegree, example: 'PhD', description: 'Instructor degree' })
    @IsEnum(InstructorDegree)
    @IsOptional()
    instructor_degree?: InstructorDegree;

    @ApiProperty({ example: 'Expert in AI', description: 'Additional notes' })
    @IsString()
    @IsOptional()
    notes?: string;
}