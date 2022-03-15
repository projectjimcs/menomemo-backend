import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Patient } from 'src/entities/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>
  ) {}

  async getPatientsByCompanyUuid(uuid: string, onlyActives: boolean = true): Promise<Patient[] | undefined> {
    const company = await this.companyRepository.findOne({
      where: {
        uuid: uuid,
      }
    });

    const query = [
      {
        companyId: company.id,
        status: 'active',
      }
    ];

    if (!onlyActives) {
      query.push({
        companyId: company.id,
        status: 'inactive',
      });
    }

    const patients = await this.patientRepository.find({
      where: query,
    });

    return patients;
  }

  async getPatientByUuid(uuid: string): Promise<Patient | undefined> {
    const patient = await this.patientRepository.findOne({
      where: {
        uuid: uuid,
      }
    });

    return patient;
  }
}
