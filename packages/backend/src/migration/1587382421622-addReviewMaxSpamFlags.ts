import { MigrationInterface, QueryRunner } from "typeorm"

export class addReviewMaxSpamFlags1587382421622 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "alter table course add column max_review_spam_flags int default 3",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "alter table course drop column max_review_spam_flags",
    )
  }
}
