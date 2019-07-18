import { MigrationInterface, QueryRunner } from "typeorm"

export class setAutoConfirm1563435269763 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`update quiz set auto_confirm = false`)
    await queryRunner.query(
      `update quiz set auto_confirm = true where course_id = '38240a7b-7e64-4202-91e2-91f6d46f6198'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`update quiz set auto_confirm = true`)
  }
}
