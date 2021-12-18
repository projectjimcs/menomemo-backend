import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  JoinColumn,
} from 'typeorm';
import { UserType } from './usertype.entity';
import * as bcrypt from 'bcrypt';

@Entity({name: 'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  password: string;

  @Column()
  @Generated("uuid")
  uuid: string;

  @Column({
    name: 'company_id',
    nullable: true,
  })
  companyId: number;

  @Column({ default: 'active' })
  status: string;

  @Column({
    name: 'usertype_id',
  })
  usertypeId: number;

  @ManyToOne(() => UserType, usertype => usertype.users, { eager: true })
  @JoinColumn({
    name: 'usertype_id',
  })
  usertype: UserType;

  @Column({
    name: 'refresh_token',
    nullable: true,
  })
  refreshToken: string;

  @Column({
    type: 'timestamp',
    name: 'refresh_token_exp',
    nullable: true,
  })
  refreshTokenExp: Date;

  @Column({
    name: 'created_by',
    nullable: true,
  })
  createdBy: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
  })
  deletedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}