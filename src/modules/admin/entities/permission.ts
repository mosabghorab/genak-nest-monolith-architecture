import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionGroup } from '../enums/permission-group.enum';
import { PermissionAction } from '../enums/permission-action.enum';
import { RolesPermissions } from './roles-permissions.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: PermissionAction })
  action: PermissionAction;

  @Column({ type: 'enum', enum: PermissionGroup })
  group: PermissionGroup;

  // relations.
  // one to many.
  @OneToMany(
    () => RolesPermissions,
    (rolesPermissions) => rolesPermissions.permission,
    { cascade: true },
  )
  rolesPermissions: RolesPermissions[];
}
