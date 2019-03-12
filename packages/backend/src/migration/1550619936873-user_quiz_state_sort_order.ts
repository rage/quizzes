import { MigrationInterface, QueryRunner } from "typeorm"

// tslint:disable-next-line:class-name
export class userQuizStateSortOrder1550619936873 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "create if not exists index user_quiz_state_sort_order on user_quiz_state (peer_reviews_given desc nulls last, peer_reviews_received asc nulls first)",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("drop index user_quiz_state_sort_order")
  }
}
