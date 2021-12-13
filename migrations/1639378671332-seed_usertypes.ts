import {MigrationInterface, QueryRunner} from "typeorm";

export class seedUsertypes1639253401064 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner
        .manager
        .createQueryBuilder()
        .insert()
        .into('usertypes')
        .values([
          {
            key: 'internal',
            name: 'Internal',
          },
          {
            key: 'admin',
            name: 'Administrator',
          },
          {
            key: 'employee',
            name: 'Employee',
          }
        ])
        .execute();  
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner
        .manager
        .createQueryBuilder()
        .delete()
        .from('usertypes')
        .where('key IN (:...keys)', {keys: ['admin', 'employee', 'internal'] })
        .execute();
    }

}
