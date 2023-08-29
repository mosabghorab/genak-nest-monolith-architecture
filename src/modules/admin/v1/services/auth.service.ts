import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../../../shared/enums/user-type.enum';
import { SignInWithEmailAndPasswordDto } from '../dtos/auth/sign-in-with-email-and-password.dto';
import { AdminsService } from './admins.service';
import { ChangePasswordDto } from '../dtos/auth/change-password.dto';
import { Admin } from '../../entities/admin.entity';
import { AuthedUser } from '../../../../core/types/authed-user.type';

@Injectable()
export class AuthService {
  constructor(private readonly adminsService: AdminsService, private readonly jwtService: JwtService) {}

  // sign in with email and password.
  async signInWithEmailAndPassword(signInWithEmailAndPasswordDto: SignInWithEmailAndPasswordDto): Promise<any> {
    const admin: Admin = await this.adminsService.findOneOrFailByEmail(signInWithEmailAndPasswordDto.email, null, { adminsRoles: { role: { rolesPermissions: { permission: true } } } });
    if (!(await admin.comparePassword(signInWithEmailAndPasswordDto.password))) {
      throw new UnauthorizedException('Wrong email or password.');
    }
    const accessToken: string = await this.jwtService.signAsync(<AuthedUser>{
      id: admin.id,
      type: UserType.ADMIN,
      adminsRoles: admin.adminsRoles,
    });
    return { ...admin, accessToken };
  }

  // change password.
  changePassword(adminId: number, changePasswordDto: ChangePasswordDto): Promise<Admin> {
    return this.adminsService.changePassword(adminId, changePasswordDto);
  }
}
