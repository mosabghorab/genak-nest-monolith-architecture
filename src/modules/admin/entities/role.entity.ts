import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolesPermissions } from './roles-permissions.entity';
import { AdminsRoles } from './admins-roles.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // one to many.
  @OneToMany(
    () => RolesPermissions,
    (rolesPermissions) => rolesPermissions.role,
    { cascade: true },
  )
  rolesPermissions: RolesPermissions[];

  @OneToMany(() => AdminsRoles, (adminRoles) => adminRoles.role, {
    cascade: true,
  })
  adminsRoles: AdminsRoles[];
}
