import { MigrationInterface, QueryRunner, TableIndex } from "typeorm"

export class CreateTableUserCourseRole1566807284426
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE TYPE role_enum AS ENUM ('teacher', 'assistant', 'reviewer');",
    )

    await queryRunner.query(
      "CREATE TABLE IF NOT EXISTS user_course_role (id uuid PRIMARY KEY DEFAULT uuid_generate_v4() , user_id integer NOT NULL, course_id uuid NOT NULL, role role_enum NOT NULL," +
        " created_at timestamp without time zone DEFAULT NOW(), updated_at timestamp without time zone DEFAULT NOW(), " +
        '  FOREIGN KEY (course_id) REFERENCES course (id), FOREIGN KEY (user_id) REFERENCES "user" (id));',
    )

    await queryRunner.createIndices("user_course_role", [
      new TableIndex({
        name: "IDX_USER_ID",
        columnNames: ["user_id"],
      }),
      new TableIndex({
        name: "IDX_COURSE_ID",
        columnNames: ["course_id"],
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropIndex("user_course_role", "IDX_USER_ID")
    await queryRunner.dropIndex("user_course_role", "IDX_COURSE_ID")
    await queryRunner.query("DROP TABLE IF EXISTS user_course_role;")
    await queryRunner.query("DROP TYPE IF EXISTS role_enum;")
  }
}
