import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { EnrollmentService } from "./enrollments.service";
import { CreateEnrollmentDto } from "./dtos/create-enrollment.dto";
import { AuthRolesGuard } from "src/users/guards/auth-role.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { Role } from "utils/enum";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import * as type from "utils/type";

@Controller('api/enrollments')
export class EnrollmentController {
    constructor(
        private readonly enrollmentService: EnrollmentService,
    ) { }

    // POST: ~/api/enrollments
    @Post()
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    async createEnrollment(
        @Body() createEnrollmentDto: CreateEnrollmentDto,
        @CurrentUser() user: type.JWTPayloadType
    ) {
        return this.enrollmentService.createEnrollment(createEnrollmentDto, user.sub);
    }
}