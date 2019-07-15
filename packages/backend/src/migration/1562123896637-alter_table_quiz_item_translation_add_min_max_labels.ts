import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class alterTableQuizItemTranslationAddMinMaxLabels1562123896637
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "quiz_item_translation",
      new TableColumn({
        name: "min_label",
        type: "varchar",
        isNullable: true,
      }),
    )
    await queryRunner.addColumn(
      "quiz_item_translation",
      new TableColumn({
        name: "max_label",
        type: "varchar",
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("quiz_item_translation", "min_label")
    await queryRunner.dropColumn("quiz_item_tranlsation", "max_label")
  }
}
