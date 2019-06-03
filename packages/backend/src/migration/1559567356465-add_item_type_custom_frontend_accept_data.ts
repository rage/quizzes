import { MigrationInterface, QueryRunner } from "typeorm"

// tslint:disable-next-line:class-name
export class addItemTypeCustomFrontendAcceptData1559567356465
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "create type quiz_item_type_enum_new as enum ('open', 'scale', 'essay', 'multiple-choice', 'checkbox', 'research-agreement', 'feedback', 'custom-frontend-accept-data')",
    )
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "alter table quiz_item alter column type set data type quiz_item_type_enum_new using (type::text::quiz_item_type_enum_new)",
    )
    await queryRunner.query("drop type quiz_item_type_enum")
    await queryRunner.query(
      "alter type quiz_item_type_enum_new rename to quiz_item_type_enum",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "create type quiz_item_type_enum_rollback as enum ('open', 'scale', 'essay', 'multiple-choice', 'checkbox', 'research-agreement', 'feedback')",
    )
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "alter table quiz_item alter column type set data type quiz_item_type_enum_rollback using (type::text::quiz_item_type_enum_rollback)",
    )
    await queryRunner.query("drop type quiz_item_type_enum")
    await queryRunner.query(
      "alter type quiz_item_type_enum_rollback rename to quiz_item_type_enum",
    )
  }
}
