import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class alterTableQuizAddColumnPointsDisplayed1565625005706
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE quiz ADD points_displayed display_points_policy_enum NOT NULL DEFAULT 'display_everything';",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("quiz", "points_displayed")
  }
}
