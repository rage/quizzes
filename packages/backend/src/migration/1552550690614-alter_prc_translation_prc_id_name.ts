import { MigrationInterface, QueryRunner } from "typeorm"

// tslint:disable-next-line:class-name
export class alterPrcTranslationPrcIdName1552550690614
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "alter table peer_review_collection_translation rename column peer_review_question_collection_id to peer_review_collection_id",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "alter table peer_review_collection_translation rename column peer_review_collection_id to peer_review_question_collection_id",
    )
  }
}
