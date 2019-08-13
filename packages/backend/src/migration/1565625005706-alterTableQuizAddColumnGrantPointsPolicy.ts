import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class alterTableQuizAddColumnGrantPointsPolicy1565625005706
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE quiz ADD grant_points_policy grant_points_policy_enum NOT NULL DEFAULT 'grant_whenever_possible';",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("quiz", "grant_points_policy")
  }
}
