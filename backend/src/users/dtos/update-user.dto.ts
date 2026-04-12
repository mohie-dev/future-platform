import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Role } from "utils/enum";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(150)
    full_name?: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(150)
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(11)
    @MaxLength(11)
    phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    address?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(150)
    password?: string;

    @IsOptional()
    @IsString()
    @MinLength(14)
    @MaxLength(14)
    national_id?: string;
}