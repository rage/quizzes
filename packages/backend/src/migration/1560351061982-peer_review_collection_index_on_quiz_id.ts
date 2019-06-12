import { MigrationInterface, QueryRunner } from "typeorm"

export class peerReviewCollectionIndexOnQuizId1560351061982
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE INDEX IF NOT EXISTS peer_review_collection_column_quiz_id ON peer_review_collection (quiz_id asc)",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP INDEX peer_review_collection_column_quiz_id")
  }
}
