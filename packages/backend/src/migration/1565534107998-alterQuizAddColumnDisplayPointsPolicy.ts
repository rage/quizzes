import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class createDisplayPointsPolicyEnum1565534107998
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE TYPE show_correct_answers_policy_enum AS ENUM ('show_always', 'show_only_when_fully_correct');",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "DROP TYPE IF EXISTS show_correct_answers_policy_enum;",
    )
  }
}
