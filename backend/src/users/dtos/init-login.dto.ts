import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class InitLoginDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(14)
  @MaxLength(14)
  national_id: string;
}
