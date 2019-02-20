import { MigrationInterface, QueryRunner } from "typeorm"

export class quizAnswerSortOrder1550599336225 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "create index quiz_answer_sort_order on quiz_answer (status asc, created_at asc)",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("drop index quiz_answer_sort_order")
  }
}
