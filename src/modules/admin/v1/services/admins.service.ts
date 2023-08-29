import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Admin } from '../../entities/admin.entity';
import { CreateAdminDto } from '../dtos/admins/create-admin.dto';
import { UpdateAdminDto } from '../dtos/admins/update-admin.dto';
import { FindAllAdminsDto } from '../dtos/admins/find-all-admins.dto';
import { AdminsRoles } from '../../entities/admins-roles.entity';
import { AdminsRolesService } from './admins-roles.service';
import { UpdateProfileDto } from '../dtos/profile/update-profile.dto';
import { ChangePasswordDto } from '../dtos/auth/change-password.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly adminsRolesService: AdminsRolesService,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Admin>): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<Admin>): Promise<Admin> {
    const admin: Admin = await this.findOneById(id, relations);
    if (!admin) {
      throw new BadRequestException(failureMessage || 'Admin not found.');
    }
    return admin;
  }

  // find one by email.
  findOneByEmail(email: string, relations?: FindOptionsRelations<Admin>): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { email },
      relations: relations,
    });
  }

  // find one or fail by email.
  async findOneOrFailByEmail(email: string, failureMessage?: string, relations?: FindOptionsRelations<Admin>): Promise<Admin> {
    const admin: Admin = await this.findOneByEmail(email, relations);
    if (!admin) {
      throw new BadRequestException(failureMessage || 'Admin not found.');
    }
    return admin;
  }

  // find all.
  async findAll(findAllAdminsDto: FindAllAdminsDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Admin[];
    currentPage: number;
  }> {
    const offset: number = (findAllAdminsDto.page - 1) * findAllAdminsDto.limit;
    const [customers, count]: [Admin[], number] = await this.adminRepository.findAndCount({
      relations: {
        adminsRoles: { role: true },
      },
      skip: offset,
      take: findAllAdminsDto.limit,
    });
    return {
      perPage: findAllAdminsDto.limit,
      currentPage: findAllAdminsDto.page,
      lastPage: Math.ceil(count / findAllAdminsDto.limit),
      total: count,
      data: customers,
    };
  }

  // create.
  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const adminByEmail = await this.findOneByEmail(createAdminDto.email);
    if (adminByEmail) {
      throw new BadRequestException('Email is already exists.');
    }
    const savedAdmin = await this.adminRepository.save(await this.adminRepository.create(createAdminDto));
    savedAdmin.adminsRoles = createAdminDto.rolesIds.map(
      (e: number) =>
        <AdminsRoles>{
          adminId: savedAdmin.id,
          roleId: e,
        },
    );
    return await this.adminRepository.save(savedAdmin);
  }

  // update.
  async update(adminId: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin: Admin = await this.findOneOrFailById(adminId, null, { adminsRoles: true });
    if (updateAdminDto.email) {
      const adminByEmail = await this.findOneByEmail(updateAdminDto.email);
      if (adminByEmail) {
        throw new BadRequestException('Email is already exists.');
      }
    }
    if (updateAdminDto.rolesIds) {
      await this.adminsRolesService.removeAllByAdminId(adminId);
      admin.adminsRoles = updateAdminDto.rolesIds.map(
        (e: number) =>
          <AdminsRoles>{
            adminId: admin.id,
            roleId: e,
          },
      );
    }
    Object.assign(admin, updateAdminDto);
    return this.adminRepository.save(admin);
  }

  // remove.
  async remove(id: number): Promise<Admin> {
    const admin: Admin = await this.findOneOrFailById(id);
    return this.adminRepository.remove(admin);
  }

  // count.
  count(): Promise<number> {
    return this.adminRepository.count();
  }

  // update profile.
  async updateProfile(adminId: number, updateProfileDto: UpdateProfileDto): Promise<Admin> {
    const admin: Admin = await this.findOneOrFailById(adminId);
    if (updateProfileDto.email) {
      const adminByEmail = await this.findOneByEmail(updateProfileDto.email);
      if (adminByEmail) {
        throw new BadRequestException('Email is already exists.');
      }
    }
    Object.assign(admin, updateProfileDto);
    return this.adminRepository.save(admin);
  }

  // change password.
  async changePassword(adminId: number, changePasswordDto: ChangePasswordDto): Promise<Admin> {
    const admin: Admin = await this.findOneOrFailById(adminId);
    if (!(await admin.comparePassword(changePasswordDto.oldPassword))) {
      throw new BadRequestException('Wrong old password.');
    }
    admin.password = changePasswordDto.newPassword;
    return this.adminRepository.save(admin);
  }
}
