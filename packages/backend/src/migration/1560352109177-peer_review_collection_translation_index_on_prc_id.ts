import { MigrationInterface, QueryRunner } from "typeorm"

export class peerReviewCollectionTranslationIndexOnPrcId1560352109177
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE INDEX IF NOT EXISTS peer_review_collection_translation_column_prc_id ON peer_review_collection_translation (peer_review_collection_id asc)",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "DROP INDEX peer_review_collection_translation_column_prc_id",
    )
  }
}
