import { MigrationInterface, QueryRunner } from "typeorm"

export class quizItemAnswerSortOrder1560331527185
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE INDEX IF NOT EXISTS quiz_item_answer_sort_order ON quiz_item_answer (quiz_answer_id asc, created_at asc)",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP INDEX quiz_item_answer_sort_order")
  }
}
