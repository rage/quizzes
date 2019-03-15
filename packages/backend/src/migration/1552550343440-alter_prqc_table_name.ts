import { MigrationInterface, QueryRunner } from "typeorm"

// tslint:disable-next-line:class-name
export class alterPrqcTableName1552550343440 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(
      "alter table peer_review_question_collection rename to peer_review_collection",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(
      "alter table peer_review_collection rename to peer_review_question_collection",
    )
  }
}
