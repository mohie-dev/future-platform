import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Gender, Role } from "../../../utils/enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'John Doe', description: 'User full name' })
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(150)
    full_name?: string;

    @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'User email address' })
    @IsOptional()
    @IsEmail()
    @MaxLength(150)
    email?: string;

    @ApiPropertyOptional({ example: '01000000000', description: 'Phone number (11 digits)' })
    @IsOptional()
    @IsString()
    @MinLength(11)
    @MaxLength(11)
    phone?: string;

    @ApiPropertyOptional({ example: '123 Street Name, City', description: 'Physical address' })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    address?: string;

    @ApiPropertyOptional({ enum: Role })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @ApiPropertyOptional({ enum: Gender, example: 'male', description: 'Gender (male or female)' })
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @ApiPropertyOptional({ example: 'password123', description: 'User password', minLength: 6 })
    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(150)
    password?: string;

    @ApiPropertyOptional({ example: '29001010101012', description: 'National ID (14 digits)' })
    @IsOptional()
    @IsString()
    @MinLength(14)
    @MaxLength(14)
    national_id?: string;

    @ApiPropertyOptional({ example: '2000-01-01', description: 'Date of birth (YYYY-MM-DD)' })
    @IsOptional()
    @IsString()
    date_of_birth?: string;
}