import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { Patient } from './patient.entity';

@Entity({name: 'bookings'})
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'company_id',
  })
  companyId: number;

  @ManyToOne(() => Company, company => company.bookings)
  @JoinColumn({
    name: 'company_id',
  })
  company: Company;

  @Column({ type: "date" })
  date;

  @Column({
    name: 'start_time',
    type: "time",
    nullable: true,
 })
  startTime;

  @Column({
    name: 'end_time',
    type: "time",
    nullable: true,
 })
  endTime;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  notes: string;
  
  @Column({
    name: 'patient_id',
  })
  patientId: number;

  @ManyToOne(() => Patient, patient => patient.bookings, { eager: true })
  @JoinColumn({
    name: 'patient_id',
  })
  patient: Patient;

  @Column({
    name: 'booked_by', // !!! Should change this to booked_by_id
  })
  bookedBy: number;

  @Column({
    name: 'booked_with',
  })
  bookedWith: number;

  @Column({
    name: 'is_completed',
    default: false,
  })
  isCompleted: boolean;

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
}
