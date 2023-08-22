import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../../shared/enums/user-type.enum';
import { SignInWithEmailAndPasswordDto } from '../dtos/sign-in-with-email-and-password.dto';
import { AdminsService } from './admins.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly jwtService: JwtService,
  ) {}

  // sign in with email and password.
  async signInWithEmailAndPassword(
    signInWithEmailAndPasswordDto: SignInWithEmailAndPasswordDto,
  ) {
    const admin = await this.adminsService.findOneByEmail(
      signInWithEmailAndPasswordDto.email,
      { adminsRoles: { role: { rolesPermissions: { permission: true } } } },
    );
    if (
      !admin ||
      !(await admin.comparePassword(signInWithEmailAndPasswordDto.password))
    ) {
      throw new NotFoundException('Admin not found.');
    }
    const accessToken = await this.jwtService.signAsync({
      id: admin.id,
      type: UserType.ADMIN,
      adminsRoles: admin.adminsRoles,
    });
    return { ...admin, accessToken };
  }
}
