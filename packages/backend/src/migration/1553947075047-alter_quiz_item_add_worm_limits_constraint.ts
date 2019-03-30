import { MigrationInterface, QueryRunner, Check } from "typeorm"
import { TableCheck } from "typeorm/schema-builder/table/TableCheck"

export class alterQuizItemAddWormLimitsConstraint1553947075047
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropCheckConstraint("quiz_item", "min_cannot_exceed_max")
  }
}
