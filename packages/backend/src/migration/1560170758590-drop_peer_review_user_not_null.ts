import { MigrationInterface, QueryRunner } from "typeorm"

export class dropPeerReviewUserNotNull1560170758590
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(
      "ALTER TABLE peer_review ALTER COLUMN user_id DROP NOT NULL;",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(
      "ALTER TABLE peer_review ALTER COLUMN user_id SET NOT NULL;",
    )
  }
}
