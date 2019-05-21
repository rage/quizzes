import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class alterQuizItemAddColumnMinValue1558402642594
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "quiz_item",
      new TableColumn({
        name: "min_value",
        type: "smallint",
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("quiz_item", "min_value")
  }
}
