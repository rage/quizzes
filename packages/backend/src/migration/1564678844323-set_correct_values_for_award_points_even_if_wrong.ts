import { MigrationInterface, QueryRunner } from "typeorm"

export class setCorrectValuesForAwardPointsEvenIfWrong1564678844323
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `update quiz set award_points_even_if_wrong = false`,
    )
    await queryRunner.query(
      `update quiz set award_points_even_if_wrong = true where course_id = '38240a7b-7e64-4202-91e2-91f6d46f6198'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`update quiz set award_points_even_if_wrong = true`)
  }
}
