import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
        CREATE OR REPLACE FUNCTION trigger_set_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE OR REPLACE FUNCTION trigger_set_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
        IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
            NEW.updated_at = now();
            RETURN NEW;
        ELSE
            RETURN OLD;
        END IF;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON course
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON course_language
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON course_translation
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON language
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON peer_review
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON peer_review_collection
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON peer_review_collection_translation
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON peer_review_question
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON peer_review_question_translation
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON peer_review_question_answer
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON quiz
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON quiz_answer
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON quiz_item
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON quiz_item_answer
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON quiz_item_translation
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON quiz_option
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON quiz_option_answer
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON quiz_option_translation
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON quiz_translation
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON spam_flag
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON "user"
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON user_course_part_state
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON user_course_role
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();

        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON user_quiz_state
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();
    `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("DROP FUNCTION trigger_set_timestamp CASCADE")
}
