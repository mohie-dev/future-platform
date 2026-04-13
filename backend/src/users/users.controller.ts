import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Delete,
  Param,
  Put,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import * as type from 'utils/type';
import { AuthGuard } from './guards/auth.guard';
import { AuthRolesGuard } from './guards/auth-role.guard';
import { Roles } from './decorators/user-role.decorator';
import { Role } from 'utils/enum';
import { UpdateUserDto } from './dtos/update-user.dto';
import { InitLoginDto } from './dtos/init-login.dto';
import { SetPasswordDto } from './dtos/set-password.dto';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // POST: ~/api/users/auth/register
  @Post('auth/register')
  @UseGuards(AuthRolesGuard)
  @Roles(Role.ADMIN)
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  // POST: ~/api/users/auth/login
  @Post('auth/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // POST: ~/api/users/auth/init-login
  @Post('auth/init-login')
  initLogin(@Body() initLoginDto: InitLoginDto) {
    return this.authService.initLogin(initLoginDto);
  }

  // POST: ~/api/users/auth/set-password
  @Post('auth/set-password')
  @UseGuards(AuthGuard)
  setPassword(
    @Body() setPasswordDto: SetPasswordDto,
    @CurrentUser() user: type.JWTPayloadType,
  ) {
    return this.authService.setPassword(user.sub, setPasswordDto);
  }

  // GET: ~/api/users/me
  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: type.JWTPayloadType) {
    return this.usersService.getCurrentUser(user.sub);
  }

  // DELETE: ~/api/users/delete/:id
  @Delete('delete/:id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(Role.ADMIN)
  deleteUser(
    @Param('id') id: string,
    @CurrentUser() user: type.JWTPayloadType,
  ) {
    return this.usersService.deleteUser(id, user.sub);
  }

  // PATCH: ~/api/users/update/:id
  @Patch('update/:id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(Role.ADMIN)
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: type.JWTPayloadType,
  ) {
    return this.usersService.updateUser(id, updateUserDto, user.sub);
  }

  // POST: ~/api/users/add
  @Post('add')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(Role.ADMIN)
  addUser(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: type.JWTPayloadType,
  ) {
    return this.usersService.addUser(createUserDto, user.sub);
  }
}
