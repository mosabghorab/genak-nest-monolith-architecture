import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { PUBLIC_KEY } from '../metadata/public.metadata';
import { AuthedUser } from '../types/authed-user.type';
import { ALLOW_FOR_KEY } from '../metadata/allow-for.metadata';
import { Helpers } from '../helpers';
import { UserType } from '../../modules/shared/enums/user-type.enum';
import { SKIP_ADMIN_ROLES_KEY } from '../metadata/skip-admin-roles.metadata';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<any>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const token = Helpers.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    let authedUser: AuthedUser;
    try {
      authedUser = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }
    const allowFor = this.reflector.getAllAndOverride<any>(ALLOW_FOR_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!allowFor.some((e) => e == authedUser.type))
      throw new ForbiddenException();
    if (authedUser.type == UserType.ADMIN) {
      const skipAdminRoles = this.reflector.getAllAndOverride<any>(
        SKIP_ADMIN_ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (skipAdminRoles) {
        request.user = authedUser;
        return true;
      }
      // const permissionGroup = this.reflector.getAllAndOverride<any>(
      //   PERMISSIONS_TARGET_KEY,
      //   [context.getClass()],
      // );
      // const permissionAction = this.reflector.getAllAndOverride<any>(
      //   ADMIN_MUST_CAN_DO_KEY,
      //   [context.getHandler()],
      // );
      // if (
      //   !Helpers.can(permissionAction, permissionGroup, authedUser.adminsRoles)
      // ) {
      //   throw new ForbiddenException();
      // }
    }
    request.user = authedUser;
    return true;
  }
}
