import { MigrationInterface, QueryRunner } from "typeorm"

export class alterKafkaTaskAddUserId1599712506811
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("alter table kafka_task add column user_id integer")
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("alter table kafka_task drop column user_id")
  }
}
