import { MigrationInterface, QueryRunner } from "typeorm"

export class changeSpamFlagPrimaryKey1560173592790
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(
      // tslint:disable-next-line:quotemark
      'alter table spam_flag drop constraint "PK_5cda672e7413f5f6067be892a00"',
    )
    queryRunner.query(
      "alter table spam_flag add column id uuid primary key default uuid_generate_v4()",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query("alter table spam_flag drop constraint spam_flag_pkey")
    queryRunner.query(
      "alter table spam_flag add constraint spam_flag_pkey primary key (user_id, quiz_answer_id)",
    )
    queryRunner.query("alter table spam_flag drop column id")
  }
}
