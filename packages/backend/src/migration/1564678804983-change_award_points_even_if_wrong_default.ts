import { MigrationInterface, QueryRunner } from "typeorm"

export class changeAwardPointsEvenIfWrongDefault1564678804983
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table quiz alter column award_points_even_if_wrong set default false`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table quiz alter column award_points_even_if_wrong set default true`,
    )
  }
}
