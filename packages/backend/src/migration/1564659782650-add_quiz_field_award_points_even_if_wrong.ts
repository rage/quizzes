import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class addQuizFieldAwardPointsEvenIfWrong1564659782650
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      "quiz",
      new TableColumn({
        name: "award_points_even_if_wrong",
        type: "boolean",
        default: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn("quiz", "award_points_even_if_wrong")
  }
}
