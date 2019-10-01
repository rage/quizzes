import { MigrationInterface, QueryRunner } from "typeorm"

export class addMoocfiIdToCourse1569942613321 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
            alter table course add column moocfi_id uuid
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
            alter table course drop column moocfi_id
        `)
  }
}
