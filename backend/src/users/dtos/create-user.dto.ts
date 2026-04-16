import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Gender, Role } from "utils/enum";

export class CreateUserDto {
    @IsEmail()
    @MaxLength(150)
    @IsNotEmpty()
    email: string;

    @MinLength(3)
    @IsNotEmpty()
    full_name: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(14)
    @MaxLength(14)
    national_id: string;

    @IsDateString()
    @IsOptional()
    date_of_birth: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(11)
    @MaxLength(11)
    phone: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    address: string;

    @IsEnum(Role)
    @IsOptional()
    role: Role;

    @IsEnum(Gender)
    @IsNotEmpty()
    gender: Gender;
}