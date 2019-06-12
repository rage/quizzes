import { MigrationInterface, QueryRunner } from "typeorm"

export class peerReviewQuestionIndexOnPrc1560351290607
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE INDEX IF NOT EXISTS peer_review_question_column_prc_id ON peer_review_question (peer_review_collection_id asc)",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP INDEX peer_review_question_column_prc_id")
  }
}
