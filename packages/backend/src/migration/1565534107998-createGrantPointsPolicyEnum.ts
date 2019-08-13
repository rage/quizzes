import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class createGrantPointsPolicyEnum1565534107998
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE TYPE grant_points_policy_enum AS ENUM ('grant_whenever_possible', 'grant_only_when_answer_fully_correct');",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP TYPE IF EXISTS grant_points_policy_enum;")
  }
}
