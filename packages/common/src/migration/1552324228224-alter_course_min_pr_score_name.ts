import { MigrationInterface, QueryRunner } from "typeorm"

export class alterCourseMinPrScoreName1552324228224
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "alter table course rename max_negative_review_percentage to min_review_average",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "alter table course rename min_review_average to max_negative_review_percentage",
    )
  }
}
