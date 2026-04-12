import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(14)
    @MaxLength(14)
    national_id: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}