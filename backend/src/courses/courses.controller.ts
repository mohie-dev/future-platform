import { Controller, Post, Body, UseGuards, Param, Get, Put, Patch } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dtos/create-course.dto";
import { UpdateCourseDto } from "./dtos/update-course.dto";
import { AuthRolesGuard } from "src/users/guards/auth-role.guard";
import { Roles } from "src/users/decorators/user-role.decorator";
import { Role } from "utils/enum";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import * as type from 'utils/type';
import { AddPrerequisiteDto } from "./dtos/add-prerequisite.dto";

@Controller('api/courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    // POST: ~/api/courses
    @Post()
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    create(
        @Body() createCourseDto: CreateCourseDto,
        @CurrentUser() user: type.JWTPayloadType
    ) {
        return this.coursesService.createCourse(createCourseDto, user.sub);
    }

    // POST: ~/api/courses/:course_id/prerequisite
    @Post(':course_id/prerequisite')
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    addPrerequisite(
        @Param('course_id') course_id: string,
        @Body() prerequisiteId: AddPrerequisiteDto,
        @CurrentUser() user: type.JWTPayloadType
    ) {
        return this.coursesService.addPrerequisite(course_id, prerequisiteId, user.sub);
    }

    // GET: ~/api/courses
    @Get()
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    async getAllCourses() {
        return this.coursesService.getAllCourses();
    }

    // GET: ~/api/courses/:course_id
    @Get(':course_id')
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    async getCourse(@Param('course_id') course_id: string) {
        return this.coursesService.getCourse(course_id);
    }

    // PATCH: ~/api/courses/:course_id
    @Patch(':course_id')
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    async updateCourse(@Param('course_id') course_id: string, @Body() updateCourseDto: UpdateCourseDto, @CurrentUser() user: type.JWTPayloadType) {
        return this.coursesService.updateCourse(course_id, updateCourseDto, user.sub);
    }
}