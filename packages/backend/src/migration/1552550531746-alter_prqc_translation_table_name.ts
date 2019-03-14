import { MigrationInterface, QueryRunner } from "typeorm"

// tslint:disable-next-line:class-name
export class alterPrqcTranslationTableName1552550531746
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(
      "alter table peer_review_question_collection_translation rename to peer_review_collection_translation",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(
      "alter table peer_review_collection_translation rename to peer_review_question_collection_translation",
    )
  }
}
