import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class alterQuizItemAddColumnMaxValue1558402636265
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "quiz_item",
      new TableColumn({
        name: "max_value",
        type: "smallint",
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("quiz_item", "max_value")
  }
}
