import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdminStatus } from '../enums/admin-status.enum';
import { compare, genSaltSync, hashSync } from 'bcryptjs';
import { AdminsRoles } from './admins-roles.entity';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  notificationsEnabled: boolean;

  @Column({
    type: 'enum',
    enum: AdminStatus,
    default: AdminStatus.ACTIVE,
  })
  status: AdminStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // relations.
  // one to many.
  @OneToMany(() => AdminsRoles, (adminsRoles) => adminsRoles.admin, {
    cascade: true,
  })
  adminsRoles: AdminsRoles[];

  // hooks.
  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password) {
      const salt = genSaltSync(10);
      this.password = hashSync(this.password, salt);
    }
  }

  // methods.
  async comparePassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }
}
