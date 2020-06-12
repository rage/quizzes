import { MigrationInterface, QueryRunner } from "typeorm"

export class createKafkaTaskTable1569938936236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
            create table kafka_task (
                id uuid default uuid_generate_v4 (),
                course_id uuid references course(id),
                quiz_id uuid references quiz(id),
                recalculate_progress boolean default false,
                created_at timestamp with time zone default current_timestamp,
                primary key (id)
            )
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`drop table kafka_task`)
  }
}
