import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Instructor } from "./entities/instructor.entity";
import { DataSource, Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { Role } from "../../utils/enum";
import { CreateInstructorDto } from "./dtos/create-instructor.dto";
import { User } from "../users/entities/user.entity";
import { UpdateInstructorDto } from "./dtos/update-instructor.dto";

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
     * @returns {message: string, data: {user: User, instructor: Instructor}}
     */
    public async createInstructor(dto: CreateInstructorDto) {
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

    /**
     * Get instructor by id
     * @param id {string} Instructor ID
     * @returns {Instructor}
     * @throws NotFoundException if instructor not found
     */
    public async getInstructorById(id: string) {
        const instructor = await this.instructorRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!instructor) {
            throw new NotFoundException('Instructor not found');
        }
        return instructor;
    }

    public async updateInstructor(id: string, dto: UpdateInstructorDto) {
        const { user, ...instructorFields } = dto;
        
            await this.instructorRepository.manager.transaction(async (manager) => {
              const instructorUpdates = Object.fromEntries(
                Object.entries(instructorFields).filter(([_, v]) => v !== undefined)
              );
        
              if (Object.keys(instructorUpdates).length > 0) {
                await manager.update(Instructor, id, instructorUpdates);
              }
        
              if (user) {
                const instructor = await manager.findOne(Instructor, {
                  where: { id },
                  select: { user: { id: true } },
                  relations: ['user'],
                });
        
                if (!instructor) throw new NotFoundException(`Instructor ${id} not found`);
        
                const userUpdates = Object.fromEntries(
                  Object.entries(user).filter(([_, v]) => v !== undefined)
                );
        
                if (Object.keys(userUpdates).length > 0) {
                  await manager.update(User, instructor.user.id, userUpdates);
                }
              }
            });
        
            return this.getInstructorById(id);
    }

    public async getAllInstructors() {
        return this.instructorRepository.find({
            relations: ['user'],
        });
    }

    public async getNumberOfInstructors() {
        return this.instructorRepository.count();
    }
}