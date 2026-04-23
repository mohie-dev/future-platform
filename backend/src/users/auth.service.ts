import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { InitLoginDto } from './dtos/init-login.dto';
import { SetPasswordDto } from './dtos/set-password.dto';
import { JWTPayloadType } from 'utils/type';
import { BadRequestException } from '@nestjs/common';

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
      is_password_set: user.is_password_set,
    };

    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_password_set: user.is_password_set,
      },
    };
  }

  /**
   * Initial login flow (Check National ID)
   * @param initLoginDto
   * @returns status and optional setup token
   */
  public async initLogin(initLoginDto: InitLoginDto) {
    const { national_id } = initLoginDto;

    const user = await this.usersService.findByNationalId(national_id);

    if (!user.is_password_set) {
      // Issue a restricted token for password setup
      const payload: JWTPayloadType = {
        sub: user.id,
        email: user.email,
        role: user.role,
        national_id: user.national_id,
        is_password_set: false,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        requiresPasswordSetup: true,
        accessToken,
      };
    }

    return {
      requiresPasswordSetup: false,
    };
  }

  /**
   * Set password for the first time
   * @param userId
   * @param setPasswordDto
   * @returns full access token
   */
  public async setPassword(userId: string, setPasswordDto: SetPasswordDto) {
    const { newPassword, confirmPassword } = setPasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.usersService.findById(userId);

    if (user.is_password_set == true) {
      throw new ForbiddenException(
        'Password has already been set. Please login with your password.',
      );
    }

    const updatedUser = await this.usersService.updatePassword(
      userId,
      newPassword,
    );

    const payload: JWTPayloadType = {
      sub: user.id,
      email: user.email,
      role: user.role,
      national_id: user.national_id,
      is_password_set: true,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_password_set: true,
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

    if (!user.is_password_set) {
      throw new UnauthorizedException(
        'Password not set. Please use init-login.',
      );
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
      is_password_set: true,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_password_set: true,
      },
    };
  }
}
