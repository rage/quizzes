import { MigrationInterface, QueryRunner } from "typeorm"

export class setTriesLimited1563436091985 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `update quiz set tries_limited = false where course_id = '38240a7b-7e64-4202-91e2-91f6d46f6198'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `update quiz set tries_limited = true where course_id = '38240a7b-7e64-4202-91e2-91f6d46f6198'`,
    )
  }
}
