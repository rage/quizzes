import { MigrationInterface, QueryRunner, Table } from "typeorm"
import { TableCheck } from "typeorm/schema-builder/table/TableCheck"

export class alterQuizItemAddWordLimitsConstraints1553947075047
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const qiTable: Table = await queryRunner.getTable("quiz_item")
    if (
      !qiTable
        .findColumnChecks(qiTable.findColumnByName("quiz_item"))
        .some(tc => tc.name === "min_cannot_exceed_max")
    ) {
      await queryRunner.createCheckConstraint(
        "quiz_item",
        new TableCheck({
          name: "min_cannot_exceed_max",
          columnNames: ["min_words", "max_words"],
          expression:
            "(min_words IS NULL OR max_words IS NULL OR min_words <= max_words)",
        }),
      )
    }

    await queryRunner.createCheckConstraints("quiz_item", [
      new TableCheck({
        name: "min_words_is_nonnegative",
        columnNames: ["min_words"],
        expression: "min_words >= 0",
      }),
      new TableCheck({
        name: "max_words_is_nonnegative",
        columnNames: ["max_words"],
        expression: "max_words >= 0",
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropCheckConstraint("quiz_item", "min_cannot_exceed_max")
    await queryRunner.dropCheckConstraint(
      "quiz_item",
      "min_words_is_nonnegative",
    )
    await queryRunner.dropCheckConstraint(
      "quiz_item",
      "max_words_is_nonnegative",
    )
  }
}
