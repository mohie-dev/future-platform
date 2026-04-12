import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { JWTPayloadType } from 'utils/type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @param createUserDto
   * @returns JWT token and user object
   */
  public async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);

    const payload: JWTPayloadType = {
      sub: user.id,
      email: user.email,
      role: user.role,
      national_id: user.national_id,
    };

    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  /**
   * Login a user
   * @param loginDto
   * @returns JWT token and user object
   */
  public async login(loginDto: LoginDto) {
    const { national_id, password } = loginDto;

    const user = await this.usersService.findByNationalId(national_id);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JWTPayloadType = {
      sub: user.id,
      email: user.email,
      role: user.role,
      national_id: user.national_id,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
