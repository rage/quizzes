import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class ModifyTableQuizItemAddColumnUsesSharedOptionFeedbackMessage1567500257341
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "quiz_item",
      new TableColumn({
        name: "uses_shared_option_feedback_message",
        type: "boolean",
        default: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn(
      "quiz_item",
      "uses_shared_option_feedback_message",
    )
  }
}
