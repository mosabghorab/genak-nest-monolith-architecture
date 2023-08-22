import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionsGroups } from '../enums/permissions-groups.enum';
import { PermissionsActions } from '../enums/permissions-actions.enum';
import { RolesPermissions } from './roles-permissions.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: PermissionsActions })
  action: PermissionsActions;

  @Column({ type: 'enum', enum: PermissionsGroups })
  group: PermissionsGroups;

  // relations.
  // one to many.
  @OneToMany(
    () => RolesPermissions,
    (rolesPermissions) => rolesPermissions.permission,
    { cascade: true },
  )
  rolesPermissions: RolesPermissions[];
}
