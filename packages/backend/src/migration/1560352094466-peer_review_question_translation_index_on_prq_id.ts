import { MigrationInterface, QueryRunner } from "typeorm"

export class peerReviewQuestionTranslationIndexOnPrqId1560352094466
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE INDEX IF NOT EXISTS peer_review_question_translation_column_prq_id ON peer_review_question_translation (peer_review_question_id asc)",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "DROP INDEX peer_review_question_translation_column_prq_id",
    )
  }
}
