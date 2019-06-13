import { MigrationInterface, QueryRunner } from "typeorm"

export class dropQuizAnswerUserNotNull1560170357089
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(
      "ALTER TABLE quiz_answer ALTER COLUMN user_id DROP NOT NULL;",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(
      "ALTER TABLE quiz_answer ALTER COLUMN user_id SET NOT NULL;",
    )
  }
}
