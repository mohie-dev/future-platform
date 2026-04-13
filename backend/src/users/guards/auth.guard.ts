import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWTPayloadType } from 'utils/type';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async canActivate(
    context: ExecutionContext
  ) {

    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (token && type === 'Bearer') {

      try {

        const payload: JWTPayloadType = await this.jwtService.verifyAsync(
          token,
          {
            secret: this.configService.get<string>('JWT_SECRET'),
          }
        )

        request['user'] = payload;

        // Block access if password is not set (except for the set-password endpoint)
        if (payload.is_password_set === false) {
          const isSetPasswordRoute = request.url.includes(
            '/api/users/auth/set-password',
          );
          if (!isSetPasswordRoute) {
            throw new UnauthorizedException(
              'Access denied. Please set your password first.',
            );
          }
        }
      } catch (err) {
        if (err instanceof UnauthorizedException) {
          throw err;
        }
        throw new UnauthorizedException('Access denied, Invalid Token');
      }
    } else {
      throw new UnauthorizedException('Access denied, No Token Provided');
    }

    return true;
  }
}
