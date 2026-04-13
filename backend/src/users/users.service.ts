import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { Role } from 'utils/enum';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Create a new user
   * @param registerDto
   * @returns User object
   */
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, full_name, national_id, phone, address, role } =
      createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { national_id },
    });
    if (existingUser) {
      throw new BadRequestException('National ID already in use');
    }

    let hashedPassword = null;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const user = this.usersRepository.create({
      email,
      password_hash: hashedPassword,
      is_password_set: !!password,
      full_name,
      national_id,
      phone,
      address,
      role,
    });

    return this.usersRepository.save(user);
  }

  /**
   * Find user by national_id
   * @param national_id
   * @returns User object
   */
  public async findByNationalId(national_id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { national_id } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  /**
   * Get current user
   * @param id
   * @returns User object
   */
  public async getCurrentUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  /**
   * Find user by id
   * @param id
   * @returns User object
   */
  public async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  /**
   * Check if user is valid to perform an action
   * @param userId
   * @param role
   * @returns boolean
   */
  public async checkValidation(userId: string, role: Role): Promise<boolean> {
    const user = await this.findById(userId);
    if (user.role !== role) {
      throw new UnauthorizedException(
        `You are not authorized to perform this action`,
      );
    }
    return true;
  }

  /**
   * Add a new user
   * @param createUserDto
   * @returns User object
   */
  public async addUser(
    createUserDto: CreateUserDto,
    userId: string,
  ): Promise<User> {
    await this.checkValidation(userId, Role.ADMIN);

    const { password, ...rest } = createUserDto;

    let hashedPassword = null;

    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const newUser = this.usersRepository.create({
      ...rest,
      password_hash: hashedPassword,
      is_password_set: !!password,
    });

    return this.usersRepository.save(newUser);
  }

  /**
   * Delete a user
   * @param id
   * @returns void
   */
  public async deleteUser(
    id: string,
    userId: string,
  ): Promise<{ message: string }> {
    await this.checkValidation(userId, Role.ADMIN);
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
    return {
      message: 'User deleted successfully',
    };
  }

  /**
   * Update a user
   * @param id
   * @param updateUserDto
   * @returns User object
   */
  public async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    userId: string,
  ): Promise<User> {
    await this.checkValidation(userId, Role.ADMIN);

    const user = await this.findById(id);

    const { password, ...rest } = updateUserDto;

    let password_hash = user.password_hash;
    let is_password_set = user.is_password_set;

    // handle password update safely
    if (password) {
      const saltRounds = 10;
      password_hash = await bcrypt.hash(password, saltRounds);
      is_password_set = true;
    }

    const updatedUser = this.usersRepository.merge(user, {
      ...rest,
      password_hash,
      is_password_set,
    });

    return this.usersRepository.save(updatedUser);
  }

  /**
   * Update user password
   * @param id
   * @param password
   * @returns User object
   */
  public async updatePassword(id: string, password: string): Promise<User> {
    const user = await this.findById(id);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user.password_hash = hashedPassword;
    user.is_password_set = true;

    return this.usersRepository.save(user);
  }
}
