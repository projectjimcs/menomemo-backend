import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity({name: 'usertypes'})
export class UserType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  name: string;

  @OneToMany(() => User, users => users.usertype)
  users: User[];
}