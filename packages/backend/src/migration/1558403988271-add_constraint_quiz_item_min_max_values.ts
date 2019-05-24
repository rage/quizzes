import { MigrationInterface, QueryRunner, Table } from "typeorm"
import { TableCheck } from "typeorm/schema-builder/table/TableCheck"

export class addConstraintQuizItemMinMaxValues1558403988271
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createCheckConstraint(
      "quiz_item",
      new TableCheck({
        name: "min_value_less_or_eq_to_max_value",
        columnNames: ["min_value", "max_value"],
        expression:
          "(min_value IS NULL OR max_value IS NULL OR min_value <= max_value)",
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropCheckConstraint(
      "quiz_item",
      "min_value_less_or_eq_to_max_value",
    )
  }
}
