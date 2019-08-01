import { MigrationInterface, QueryRunner } from "typeorm"

export class changeAutoConfirmDefault1564659728917
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table quiz alter column auto_confirm set default true`,
    )
    await queryRunner.query(`update quiz set auto_confirm = true`)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table quiz alter column auto_confirm set default false`,
    )
    await queryRunner.query(`update quiz set auto_confirm = false`)
  }
}
