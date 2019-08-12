import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class createDisplayPointsPolicyEnum1565534107998
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE TYPE display_points_policy_enum AS ENUM ('display_everything', 'display_only_when_fully_correct');",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP TYPE IF EXISTS display_points_policy_enum;")
  }
}
