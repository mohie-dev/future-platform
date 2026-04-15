import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AssignCourseService } from "./assign.service";
import { AuthRolesGuard } from "src/users/guards/auth-role.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { Role } from "utils/enum";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import * as type from 'utils/type';
import { AssignCourseDto } from "./dtos/assign-course.dto";

@Controller('api/assign-course')
export class AssignCourseController {
    constructor(private readonly assignCourseService: AssignCourseService) { }

    @Post()
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    assignCourse(@Body() dto: AssignCourseDto, @CurrentUser() user: type.JWTPayloadType) {
        return this.assignCourseService.assignCourse(dto, user.sub);
    }
}