import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"
import { TableCheck } from "typeorm/schema-builder/table/TableCheck"

export class alterQuizItemAddMinWords1553945861049
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "quiz_item",
      new TableColumn({
        name: "min_words",
        type: "smallint",
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("quiz_item", "min_words")
  }
}
