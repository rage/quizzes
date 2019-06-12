import { MigrationInterface, QueryRunner } from "typeorm"

export class quizOptionAnswerSortOrder1560331812219
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE INDEX IF NOT EXISTS quiz_option_answer_sort_order ON quiz_option_answer (quiz_item_answer_id asc, created_at asc)",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP INDEX quiz_option_answer_sort_order")
  }
}
