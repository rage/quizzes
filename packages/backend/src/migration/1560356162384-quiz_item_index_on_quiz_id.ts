import { MigrationInterface, QueryRunner } from "typeorm"

export class quizItemIndexOnQuizId1560356162384 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE INDEX IF NOT EXISTS quiz_item_column_quiz_id ON quiz_item (quiz_id asc)",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP INDEX quiz_item_column_quiz_id")
  }
}
