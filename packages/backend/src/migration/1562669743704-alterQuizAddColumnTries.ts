import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class alterQuizAddColumnTries1562669743704
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "quiz",
      new TableColumn({
        name: "tries",
        type: "smallint",
        default: 1,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("quiz", "tries")
  }
}
