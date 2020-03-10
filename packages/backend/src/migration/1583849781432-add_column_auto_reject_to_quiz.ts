import { MigrationInterface, QueryRunner } from "typeorm"

export class addColumnAutoRejectToQuiz1583849781432
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "alter table quiz add column auto_reject boolean default true",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("alter table quiz drop column auto_reject")
  }
}
