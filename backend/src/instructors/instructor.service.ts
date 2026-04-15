import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Instructor } from "./entities/instructor.entity";
import { DataSource, Repository } from "typeorm";
import { UsersService } from "src/users/users.service";
import { Role } from "utils/enum";
import { CreateInstructorDto } from "./dtos/create-instructor.dto";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class InstructorService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(Instructor)
        private readonly instructorRepository: Repository<Instructor>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly usersService: UsersService,
    ) { }

    /**
     * Create a new instructor
     * @param dto {user: CreateUserDto, instructor: CreateInstructorDto}
     * @param admin_id 
     * @returns {message: string, data: {user: User, instructor: Instructor}}
     */
    public async createInstructor(dto: CreateInstructorDto, admin_id: string) {
        await this.usersService.checkValidation(admin_id, Role.ADMIN);

        const { user, ...instructorData } = dto;

        const existingUser = await this.userRepository.findOne({
            where: { national_id: user.national_id },
        });
        if (existingUser) {
            throw new BadRequestException('National ID already in use');
        }

        const existingInstructor = await this.instructorRepository.findOne({
            where: { instructor_code: instructorData.instructor_code },
        });
        if (existingInstructor) {
            throw new BadRequestException('Instructor code already in use');
        }

        return await this.dataSource.transaction(async (manager) => {
            const newUser = manager.create(User, {
                full_name: user.full_name,
                national_id: user.national_id,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: Role.INSTRUCTOR,
                password_hash: null,
                is_password_set: false,
                date_of_birth: new Date(user.date_of_birth),
                gender: user.gender,
            });

            const savedUser = await manager.save(newUser);

            const newInstructor = manager.create(Instructor, {
                id: savedUser.id,
                user: savedUser,

                ...instructorData,
            });

            const savedInstructor = await manager.save(newInstructor);

            return {
                message: 'Instructor created successfully',
                data: {
                    user: savedUser,
                    instructor: savedInstructor,
                },
            };
        });
    }

    public async getInstructorById(id: string) {
        const instructor = await this.instructorRepository.findOne({
            where: { id },
        });
        if (!instructor) {
            throw new NotFoundException('Instructor not found');
        }
        return instructor;
    }
}