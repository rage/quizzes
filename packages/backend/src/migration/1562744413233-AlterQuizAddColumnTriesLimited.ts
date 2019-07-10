import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterQuizAddColumnTriesLimited1562744413233
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "quiz",
      new TableColumn({
        name: "tries_limited",
        type: "boolean",
        default: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("quiz", "tries_limited")
  }
}
