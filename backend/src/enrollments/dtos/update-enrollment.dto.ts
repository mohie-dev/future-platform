import { IsEnum, IsOptional, IsString } from "class-validator";
import { EnrollmentStatus } from "utils/enum";

export class UpdateEnrollmentDto {
    @IsEnum(EnrollmentStatus)
    @IsOptional()
    status: EnrollmentStatus;

    @IsString()
    @IsOptional()
    year: string;

    @IsString()
    @IsOptional()
    semester: string;
}