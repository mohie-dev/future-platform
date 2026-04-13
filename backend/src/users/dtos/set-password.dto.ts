import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  confirmPassword: string;
}
