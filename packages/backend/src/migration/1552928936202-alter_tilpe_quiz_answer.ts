import { MigrationInterface, QueryRunner } from "typeorm"

// tslint:disable-next-line:class-name
export class alterTilpeQuizAnswer1552928936202 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "alter quiz_answer set status = 'confirmed' where quiz_id = 'a18fe51a-80a8-41a7-99a5-d591ccba2f9a'",
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "alter quiz_answer set status = 'submitted' where quiz_id = 'a18fe51a-80a8-41a7-99a5-d591ccba2f9a'",
    )
  }
}
