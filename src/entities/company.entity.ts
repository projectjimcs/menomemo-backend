import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Patient } from './patient.entity';
import { Booking } from './booking.entity';

@Entity({name: 'companies'})
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Generated("uuid")
  uuid: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: 'UTC' })
  timezone: string;

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

  @OneToMany(() => User, user => user.company)
  users: User[];

  @OneToMany(() => Patient, patient => patient.company)
  patients: Patient[];

  @OneToMany(() => Booking, booking => booking.company)
  bookings: Booking[];
}
