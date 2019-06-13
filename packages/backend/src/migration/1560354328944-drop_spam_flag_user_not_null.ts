import { MigrationInterface, QueryRunner } from "typeorm"

export class dropSpamFlagUserNotNull1560354328944
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(
      "ALTER TABLE spam_flag ALTER COLUMN user_id DROP NOT NULL;",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(
      "ALTER TABLE spam_flag ALTER COLUMN user_id SET NOT NULL;",
    )
  }
}
