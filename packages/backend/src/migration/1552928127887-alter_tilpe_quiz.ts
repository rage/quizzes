import { MigrationInterface, QueryRunner } from "typeorm"

// tslint:disable-next-line:class-name
export class alterTilpeQuiz1552928127887 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "update quiz_item set type = 'feedback' where id = 'a00df990-7f74-4c8b-85e7-15285d74046c'",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "update quiz_item set type = 'essay' where id = 'a00df990-7f74-4c8b-85e7-15285d74046c'",
    )
  }
}
