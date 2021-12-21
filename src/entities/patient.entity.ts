import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Company } from './company.entity';
import { Booking } from './booking.entity';

@Entity({name: 'patients'})
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  @Generated("uuid")
  uuid: string;

  @Column({
    nullable: true,
  })
  email: string;

  @Column()
  phone: number;

  @Column({
    name: 'company_id',
    nullable: true,
  })
  companyId: number;

  @ManyToOne(() => Company, company => company.patients)
  @JoinColumn({
    name: 'company_id',
  })
  company: Company;

  @Column({ default: 'active' })
  status: string;
  
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

  @OneToMany(() => Booking, booking => booking.patient)
  bookings: Booking[];
}
