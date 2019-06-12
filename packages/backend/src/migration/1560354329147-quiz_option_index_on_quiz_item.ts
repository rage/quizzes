import { MigrationInterface, QueryRunner } from "typeorm"

export class quizOptionIndexOnQuizItem1560354329147
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE INDEX IF NOT EXISTS quiz_option_column_quiz_item_id ON quiz_option (quiz_item_id asc)",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP INDEX quiz_option_column_quiz_item_id")
  }
}
