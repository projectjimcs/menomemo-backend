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

  @Generated("uuid")
  uuid: string;

  @Column({ default: 'active' })
  status: string;

  @Column({
    name: 'usertype_id',
  })
  usertypeId: number;

  @ManyToOne(() => UserType, usertypes => usertypes.users)
  @JoinColumn({
    name: 'usertype_id',
  })
  usertype: UserType;

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