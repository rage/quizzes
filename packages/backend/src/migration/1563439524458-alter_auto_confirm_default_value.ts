import { MigrationInterface, QueryRunner } from "typeorm"

export class alterAutoConfirmDefaultValue1563439524458
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table quiz alter column auto_confirm set default false`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table quiz alter column auto_confirm set default true`,
    )
  }
}
