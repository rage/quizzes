import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class ModifyTableQuizItemTranslationAddColumnSharedOptionFeedbackMessage1567500302676
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "quiz_item_translation",
      new TableColumn({
        name: "shared_option_feedback_message",
        type: "varchar",
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn(
      "quiz_item_translation",
      "shared_option_feedback_message",
    )
  }
}
