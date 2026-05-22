import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Put,
    Param
} from "@nestjs/common";
import { InstructorService } from "./instructor.service";
import { AuthRolesGuard } from "../users/guards/auth-role.guard";
import { Roles } from "../users/decorators/user-role.decorator";
import { Role } from "../../utils/enum";
import { CreateInstructorDto } from "./dtos/create-instructor.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UpdateInstructorDto } from "./dtos/update-instructor.dto";

@ApiTags('Instructors')
@Controller('api/instructors')
export class InstructorController {
    constructor(private readonly instructorService: InstructorService) { }

    @Post()
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new instructor (Admin only)' })
    @ApiResponse({ status: 201, description: 'Instructor successfully created' })
    create(@Body() createInstructorDto: CreateInstructorDto) {
        return this.instructorService.createInstructor(createInstructorDto);
    }

    @Get('count')
    @ApiOperation({ summary: 'Get total number of instructors' })
    async getNumberOfInstructors() {
        return this.instructorService.getNumberOfInstructors();
    }

    @Get()
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all instructors with user details' })
    async getAllInstructors() {
        return this.instructorService.getAllInstructors();
    }

    @Get(':id')
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get instructor by ID' })
    async getInstructorById(@Param('id') id: string) {
        return this.instructorService.getInstructorById(id);
    }

    @Put(':id')
    @UseGuards(AuthRolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update instructor details (Admin only)' })
    @ApiResponse({ status: 200, description: 'Instructor successfully updated' })
    async updateInstructor(@Param('id') id: string, @Body() updateInstructorDto: UpdateInstructorDto) {
        return this.instructorService.updateInstructor(id, updateInstructorDto);
    }
}