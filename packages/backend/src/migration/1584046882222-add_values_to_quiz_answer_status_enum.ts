import { MigrationInterface, QueryRunner } from "typeorm"

export class addValuesToQuizAnswerStatusEnum1584046882222
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "DROP MATERIALIZED VIEW IF EXISTS reaktor.spam_flag, reaktor.peer_review_question_answer; " +
        "DROP MATERIALIZED VIEW IF EXISTS reaktor.peer_review; " +
        "DROP MATERIALIZED VIEW IF EXISTS reaktor.quiz_answer; ",
    )

    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "create type quiz_answer_status_enum_new as enum ('draft', 'given-more-than-enough', 'given-enough', 'submitted',  'manual-review', 'confirmed', 'enough-received-but-not-given', 'spam','rejected','deprecated')",
    )
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "alter table quiz_answer alter column status set data type quiz_answer_status_enum_new using (status::text::quiz_answer_status_enum_new)",
    )
    await queryRunner.query("drop type quiz_answer_status_enum")
    await queryRunner.query(
      "alter type quiz_answer_status_enum_new rename to quiz_answer_status_enum",
    )

    await this.createMaterializedViews(queryRunner)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "DROP MATERIALIZED VIEW IF EXISTS reaktor.spam_flag, reaktor.peer_review_question_answer; " +
        "DROP MATERIALIZED VIEW IF EXISTS reaktor.peer_review; " +
        "DROP MATERIALIZED VIEW IF EXISTS reaktor.quiz_answer; ",
    )

    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "create type quiz_answer_status_enum_rollback as enum ('draft', 'submitted', 'enough-received-but-not-given', 'spam', 'confirmed', 'rejected', 'deprecated')",
    )
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      "alter table quiz_answer alter column status set data type quiz_answer_status_enum_rollback using (status::text::quiz_answer_status_enum_rollback)",
    )
    await queryRunner.query("drop type quiz_answer_status_enum")
    await queryRunner.query(
      "alter type quiz_answer_status_enum_rollback rename to quiz_answer_status_enum",
    )

    await this.createMaterializedViews(queryRunner)
  }

  private async createMaterializedViews(queryRunner: QueryRunner) {
    await queryRunner.query(
      `CREATE MATERIALIZED VIEW reaktor.quiz_answer AS SELECT quiz_answer.id,
      quiz_answer.quiz_id,
      quiz_answer.user_id,
      quiz_answer.language_id,
      quiz_answer.status,
      quiz_answer.created_at,
      quiz_answer.updated_at
     FROM quiz_answer
    WHERE (quiz_answer.quiz_id IN ( SELECT quiz.id
             FROM reaktor.quiz))`,
    )

    await queryRunner.query(
      `CREATE MATERIALIZED VIEW reaktor.peer_review AS SELECT peer_review.id,
              peer_review.quiz_answer_id,
              peer_review.user_id,
              peer_review.peer_review_collection_id,
              peer_review.rejected_quiz_answer_ids,
              peer_review.created_at,
              peer_review.updated_at
             FROM peer_review
            WHERE (peer_review.quiz_answer_id IN ( SELECT quiz_answer.id
                     FROM reaktor.quiz_answer))`,
    )

    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      `CREATE MATERIALIZED VIEW reaktor.peer_review_question_answer AS SELECT peer_review_question_answer.peer_review_id,
                      peer_review_question_answer.peer_review_question_id,
                      peer_review_question_answer.value,
                      peer_review_question_answer.text,
                      peer_review_question_answer.created_at,
                      peer_review_question_answer.updated_at
                     FROM peer_review_question_answer
                    WHERE (peer_review_question_answer.peer_review_id IN ( SELECT peer_review.id
                             FROM reaktor.peer_review))`,
    )

    await queryRunner.query(
      `CREATE MATERIALIZED VIEW reaktor.spam_flag AS  SELECT spam_flag.user_id,
                              spam_flag.quiz_answer_id,
                              spam_flag.created_at,
                              spam_flag.updated_at,
                              spam_flag.id
                             FROM spam_flag
                            WHERE (spam_flag.quiz_answer_id IN ( SELECT quiz_answer.id
                                     FROM reaktor.quiz_answer))`,
    )

    await queryRunner.query("create index on reaktor.quiz_answer(id)")
    await queryRunner.query("create index on reaktor.quiz_answer(status)")
    await queryRunner.query(
      "create index on reaktor.peer_review_collection(id)",
    )
    await queryRunner.query(
      "create index on reaktor.peer_review_question_answer (peer_review_id, peer_review_question_id)",
    )
    await queryRunner.query("create index on reaktor.spam_flag (id)")

    const result = await queryRunner.query(
      "SELECT 1 FROM pg_roles WHERE rolname='reaktor'",
    )

    if (result.length > 0) {
      await queryRunner.query(
        "GRANT SELECT ON ALL TABLES IN SCHEMA reaktor TO reaktor",
      )
    }
  }
}
