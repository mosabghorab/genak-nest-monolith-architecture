import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Admin } from '../entities/admin.entity';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { UpdateAdminDto } from '../dtos/update-admin.dto';
import { FindAllAdminsDto } from '../dtos/find-all-admins.dto';
import { Helpers } from '../../../core/helpers';
import { AdminsRoles } from '../entities/admins-roles.entity';
import { AdminsRolesService } from './admins-roles.service';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly adminsRolesService: AdminsRolesService,
  ) {}

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Admin>) {
    return this.adminRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find one by email.
  findOneByEmail(email: string, relations?: FindOptionsRelations<Admin>) {
    return this.adminRepository.findOne({
      where: { email },
      relations: relations,
    });
  }

  // find all.
  async findAll(
    findAllAdminsDto: FindAllAdminsDto,
    relations?: FindOptionsRelations<Admin>,
  ) {
    const offset = (findAllAdminsDto.page - 1) * findAllAdminsDto.limit;
    const queryBuilder = this.adminRepository.createQueryBuilder('admin');
    if (relations) {
      Helpers.buildRelationsForQueryBuilder<Admin>(
        queryBuilder,
        relations,
        'admin',
      );
    }
    queryBuilder.skip(offset).take(findAllAdminsDto.limit);
    const [admins, count] = await queryBuilder.getManyAndCount();
    return {
      perPage: findAllAdminsDto.limit,
      currentPage: findAllAdminsDto.page,
      lastPage: Math.ceil(count / findAllAdminsDto.limit),
      total: count,
      data: admins,
    };
  }

  // create.
  async create(createAdminDto: CreateAdminDto) {
    const adminByEmail = await this.findOneByEmail(createAdminDto.email);
    if (adminByEmail) {
      throw new BadRequestException('Email is already exists.');
    }
    const savedAdmin = await this.adminRepository.save(
      await this.adminRepository.create(createAdminDto),
    );
    savedAdmin.adminsRoles = createAdminDto.rolesIds.map(
      (e) =>
        <AdminsRoles>{
          adminId: savedAdmin.id,
          roleId: e,
        },
    );
    return await this.adminRepository.save(savedAdmin);
  }

  // update.
  async update(adminId: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.findOneById(adminId, { adminsRoles: true });
    if (!admin) {
      throw new NotFoundException('Admin not found.');
    }
    if (updateAdminDto.email) {
      const adminByEmail = await this.findOneByEmail(updateAdminDto.email);
      if (adminByEmail) {
        throw new BadRequestException('Email is already exists.');
      }
    }
    if (updateAdminDto.rolesIds) {
      await this.adminsRolesService.removeByAdminId(adminId);
      admin.adminsRoles = updateAdminDto.rolesIds.map(
        (e) =>
          <AdminsRoles>{
            adminId: admin.id,
            roleId: e,
          },
      );
    }
    Object.assign(admin, updateAdminDto);
    return this.adminRepository.save(admin);
  }

  // update profile.
  async updateProfile(adminId: number, updateProfileDto: UpdateProfileDto) {
    const admin = await this.findOneById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin not found.');
    }
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
  async changePassword(adminId: number, changePasswordDto: ChangePasswordDto) {
    const admin = await this.findOneById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin not found.');
    }
    if (!(await admin.comparePassword(changePasswordDto.oldPassword))) {
      throw new BadRequestException('Wrong old password.');
    }
    admin.password = changePasswordDto.newPassword;
    return this.adminRepository.save(admin);
  }

  // remove.
  async remove(id: number) {
    const admin = await this.findOneById(id);
    if (!admin) {
      throw new NotFoundException('Admin not found.');
    }
    return this.adminRepository.remove(admin);
  }
}
