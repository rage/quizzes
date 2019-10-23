import { MigrationInterface, QueryRunner } from "typeorm"

export class alterQuizAnswerStatusEnum1571840092691
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "create type quiz_answer_status_enum_new as enum ('draft', 'submitted', 'enough-received-but-not-given', 'spam', 'confirmed', 'rejected', 'deprecated')",
    )
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "alter table quiz_answer alter column status set data type quiz_answer_status_enum_new using (type::text::quiz_answer_status_enum_new)",
    )
    await queryRunner.query("drop type quiz_answer_status_enum")
    await queryRunner.query(
      "alter type quiz_answer_status_enum_new rename to quiz_answer_status_enum",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "create type quiz_answer_status_enum_rollback as enum ('draft', 'submitted', 'spam', 'confirmed', 'rejected', 'deprecated')",
    )
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "alter table quiz_answer alter column status set data type quiz_answer_status_enum_rollback using (type::text::quiz_answer_status_enum_rollback)",
    )
    await queryRunner.query("drop type quiz_answer_status_enum")
    await queryRunner.query(
      "alter type quiz_answer_status_enum_rollback rename to quiz_answer_status_enum",
    )
  }
}
