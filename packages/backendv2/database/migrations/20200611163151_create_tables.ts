import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  if (!(await knex.schema.hasTable("course"))) {
    await knex.schema.createTable("course", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .notNullable()
      table.uuid("moocfi_id")
      table.integer("organization_id")
      table.integer("min_score_to_pass")
      table.integer("min_progress_to_pass")
      table.integer("min_peer_reviews_received")
      table.integer("min_peer_reviews_given")
      table.decimal("min_review_average")
      table.integer("max_spam_flags")
      table.integer("max_review_spam_flags").defaultTo(3)
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
    })
  }
  if (!(await knex.schema.hasTable("language"))) {
    await knex.schema.createTable("language", table => {
      table
        .text("id")
        .primary()
        .notNullable()
      table.text("name").notNullable()
      table.text("country").notNullable()
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
    })
  }
  if (!(await knex.schema.hasTable("course_language"))) {
    await knex.schema.createTable("course_language", table => {
      table
        .uuid("course_id")
        .references("id")
        .inTable("course")
        .notNullable()
        .onDelete("CASCADE")
      table
        .text("language_id")
        .references("id")
        .inTable("language")
        .notNullable()
        .onDelete("CASCADE")
      table.primary(["course_id", "language_id"])
    })
  }
  if (!(await knex.schema.hasTable("course_translation"))) {
    await knex.schema.createTable("course_translation", table => {
      table
        .uuid("course_id")
        .references("id")
        .inTable("course")
        .notNullable()
        .onDelete("CASCADE")
      table
        .text("language_id")
        .references("id")
        .inTable("language")
        .notNullable()
        .onDelete("CASCADE")
      table
        .text("abbreviation")
        .defaultTo("")
        .notNullable()
      table
        .text("title")
        .defaultTo("")
        .notNullable()
      table
        .text("body")
        .defaultTo("")
        .notNullable()
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table.primary(["course_id", "language_id"])
    })
  }
  if (!(await knex.schema.hasTable("quiz"))) {
    await knex.schema.createTable("quiz", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .notNullable()
      table
        .uuid("course_id")
        .references("id")
        .inTable("course")
        .notNullable()
        .onDelete("CASCADE")
      table.integer("part").notNullable()
      table.integer("section")
      table.integer("points").notNullable()
      table.timestamp("deadline", { useTz: false })

      table.timestamp("open", { useTz: false })
      table
        .boolean("excluded_from_score")
        .notNullable()
        .defaultTo(false)
      table
        .boolean("auto_confirm")
        .notNullable()
        .defaultTo(true)
      table
        .boolean("auto_reject")
        .notNullable()
        .defaultTo(true)
      table
        .boolean("tries_limited")
        .notNullable()
        .defaultTo(true)
      table
        .integer("tries")
        .notNullable()
        .defaultTo(1)
      table
        .enu(
          "grant_points_policy",
          ["grant_whenever_possible", "grant_only_when_answer_fully_correct"],
          { useNative: true, enumName: "grant_points_policy_enum" },
        )
        .notNullable()
        .defaultTo("grant_whenever_possible")
      table
        .boolean("award_points_even_if_wrong")
        .notNullable()
        .defaultTo(false)
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
    })
  }
  if (!(await knex.schema.hasTable("quiz_translation"))) {
    await knex.schema.createTable("quiz_translation", table => {
      table
        .uuid("quiz_id")
        .references("id")
        .inTable("quiz")
        .notNullable()
        .onDelete("CASCADE")
      table
        .text("language_id")
        .references("id")
        .inTable("language")
        .notNullable()
        .onDelete("CASCADE")
      table
        .text("title")
        .defaultTo("")
        .notNullable()
      table
        .text("body")
        .defaultTo("")
        .notNullable()
      table.text("submit_message")
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table.primary(["quiz_id", "language_id"])
    })
  }
  if (!(await knex.schema.hasTable("quiz_item"))) {
    await knex.schema.createTable("quiz_item", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .notNullable()
      table
        .uuid("quiz_id")
        .references("id")
        .inTable("quiz")
        .notNullable()
        .onDelete("CASCADE")
      table
        .enu(
          "type",
          [
            "open",
            "scale",
            "essay",
            "multiple-choice",
            "checkbox",
            "research-agreement",
            "feedback",
            "custom-frontend-accept-data",
            "multiple-choice-dropdown",
            "clickable-multiple-choice",
          ],
          {
            useNative: true,
            enumName: "quiz_item_type_enum",
          },
        )
        .notNullable()
      table.integer("order").notNullable()
      table.text("validity_regex")
      table.text("format_regex")
      table.boolean("multi").defaultTo(false)
      table.integer("min_words")
      table.integer("max_words")
      table.integer("min_value")
      table.integer("max_value")
      table
        .boolean("uses_shared_option_feedback_message")
        .notNullable()
        .defaultTo(false)
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
    })
  }
  if (!(await knex.schema.hasTable("quiz_item_translation"))) {
    await knex.schema.createTable("quiz_item_translation", table => {
      table
        .uuid("quiz_item_id")
        .references("id")
        .inTable("quiz_item")
        .notNullable()
        .onDelete("CASCADE")
      table
        .text("language_id")
        .references("id")
        .inTable("language")
        .notNullable()
        .onDelete("CASCADE")
      table
        .text("title")
        .defaultTo("")
        .notNullable()
      table
        .text("body")
        .defaultTo("")
        .notNullable()
      table.text("success_message")
      table.text("failure_message")
      table.text("min_label")
      table.text("max_label")
      table.text("shared_option_feedback_message")
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table.primary(["quiz_item_id", "language_id"])
    })
  }
  if (!(await knex.schema.hasTable("quiz_option"))) {
    await knex.schema.createTable("quiz_option", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .notNullable()
      table
        .uuid("quiz_item_id")
        .references("id")
        .inTable("quiz_item")
        .notNullable()
        .onDelete("CASCADE")
      table.integer("order").notNullable()
      table.boolean("correct").notNullable()
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
    })
  }
  if (!(await knex.schema.hasTable("quiz_option_translation"))) {
    await knex.schema.createTable("quiz_option_translation", table => {
      table
        .uuid("quiz_option_id")
        .references("id")
        .inTable("quiz_option")
        .notNullable()
        .onDelete("CASCADE")
      table
        .text("language_id")
        .references("id")
        .inTable("language")
        .notNullable()
        .onDelete("CASCADE")
      table
        .text("title")
        .defaultTo("")
        .notNullable()
      table
        .text("body")
        .defaultTo("")
        .notNullable()
      table.text("success_message")
      table.text("failure_message")
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table.primary(["quiz_option_id", "language_id"])
    })
  }
  if (!(await knex.schema.hasTable("peer_review_collection"))) {
    await knex.schema.createTable("peer_review_collection", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .notNullable()
      table
        .uuid("quiz_id")
        .references("id")
        .inTable("quiz")
        .notNullable()
        .onDelete("CASCADE")
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
    })
  }
  if (!(await knex.schema.hasTable("peer_review_collection_translation"))) {
    await knex.schema.createTable(
      "peer_review_collection_translation",
      table => {
        table
          .uuid("peer_review_collection_id")
          .references("id")
          .inTable("peer_review_collection")
          .notNullable()
          .onDelete("CASCADE")
        table
          .text("language_id")
          .references("id")
          .inTable("language")
          .notNullable()
          .onDelete("CASCADE")
        table
          .text("title")
          .defaultTo("")
          .notNullable()
        table
          .text("body")
          .defaultTo("")
          .notNullable()
        table
          .timestamp("created_at", { useTz: false })
          .defaultTo(knex.fn.now())
          .notNullable()
        table
          .timestamp("updated_at", { useTz: false })
          .defaultTo(knex.fn.now())
          .notNullable()
        table.primary(["peer_review_collection_id", "language_id"])
      },
    )
  }
  if (!(await knex.schema.hasTable("peer_review_question"))) {
    await knex.schema.createTable("peer_review_question", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .notNullable()
      table
        .uuid("quiz_id")
        .references("id")
        .inTable("quiz")
        .onDelete("CASCADE")
      table
        .uuid("peer_review_collection_id")
        .references("id")
        .inTable("peer_review_collection")
        .notNullable()
        .onDelete("CASCADE")
      table.boolean("default").notNullable()
      table.integer("order").notNullable()
      table
        .enu("type", ["essay", "grade"], {
          useNative: true,
          enumName: "peer_review_question_type_enum",
        })
        .notNullable()
      table
        .boolean("answer_required")
        .notNullable()
        .defaultTo(true)
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
    })
  }
  if (!(await knex.schema.hasTable("peer_review_question_translation"))) {
    await knex.schema.createTable("peer_review_question_translation", table => {
      table
        .uuid("peer_review_question_id")
        .references("id")
        .inTable("peer_review_question")
        .notNullable()
        .onDelete("CASCADE")
      table
        .text("language_id")
        .references("id")
        .inTable("language")
        .notNullable()
        .onDelete("CASCADE")
      table
        .text("title")
        .defaultTo("")
        .notNullable()
      table
        .text("body")
        .defaultTo("")
        .notNullable()
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table.primary(["peer_review_question_id", "language_id"])
    })
  }
  if (!(await knex.schema.hasTable("user"))) {
    await knex.schema.createTable("user", table => {
      table
        .integer("id")
        .primary()
        .notNullable()
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
    })
  }
  if (!(await knex.schema.hasTable("quiz_answer"))) {
    await knex.schema.createTable("quiz_answer", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .notNullable()
      table
        .uuid("quiz_id")
        .references("id")
        .inTable("quiz")
        .notNullable()
        .onDelete("CASCADE")
      table
        .integer("user_id")
        .references("id")
        .inTable("user")
        .notNullable()
        .onDelete("CASCADE")
      table
        .text("language_id")
        .references("id")
        .inTable("language")
        .notNullable()
        .onDelete("CASCADE")
      table
        .enu(
          "status",
          [
            "draft",
            "given-more-than-enough",
            "manual-review-once-received-enough-given-more-than-enough",
            "given-enough",
            "manual-review-once-received-enough",
            "submitted",
            "manual-review-once-given-enough",
            "manual-review-once-given-and-received-enough",
            "manual-review",
            "confirmed",
            "enough-received-but-not-given",
            "spam",
            "rejected",
            "deprecated",
          ],
          {
            useNative: true,
            enumName: "quiz_answer_status_enum",
          },
        )
        .notNullable()
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
    })
  }
  if (!(await knex.schema.hasTable("quiz_item_answer"))) {
    await knex.schema.createTable("quiz_item_answer", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .notNullable()
      table
        .uuid("quiz_answer_id")
        .references("id")
        .inTable("quiz_answer")
        .notNullable()
        .onDelete("CASCADE")
      table
        .uuid("quiz_item_id")
        .references("id")
        .inTable("quiz_item")
        .notNullable()
        .onDelete("CASCADE")
      table.text("text_data")
      table.integer("int_data")
      table.boolean("correct")
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
    })
  }
  if (!(await knex.schema.hasTable("quiz_option_answer"))) {
    await knex.schema.createTable("quiz_option_answer", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .notNullable()
      table
        .uuid("quiz_item_answer_id")
        .references("id")
        .inTable("quiz_item_answer")
        .notNullable()
        .onDelete("CASCADE")
      table
        .uuid("quiz_option_id")
        .references("id")
        .inTable("quiz_option")
        .notNullable()
        .onDelete("CASCADE")
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
    })
  }
  if (!(await knex.schema.hasTable("peer_review"))) {
    await knex.schema.createTable("peer_review", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .notNullable()
      table
        .uuid("quiz_answer_id")
        .references("id")
        .inTable("quiz_answer")
        .notNullable()
        .onDelete("CASCADE")
      table
        .integer("user_id")
        .references("id")
        .inTable("user")
        .notNullable()
        .onDelete("CASCADE")
      table
        .uuid("peer_review_collection_id")
        .references("id")
        .inTable("peer_review_collection")
        .notNullable()
        .onDelete("CASCADE")
      table.specificType("rejected_quiz_answer_ids", "character varying[]")
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
    })
  }
  if (!(await knex.schema.hasTable("peer_review_question_answer"))) {
    await knex.schema.createTable("peer_review_question_answer", table => {
      table
        .uuid("peer_review_id")
        .references("id")
        .inTable("peer_review")
        .notNullable()
        .onDelete("CASCADE")
      table
        .uuid("peer_review_question_id")
        .references("id")
        .inTable("peer_review_question")
        .notNullable()
        .onDelete("CASCADE")
      table.integer("value")
      table.text("text")
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table.primary(["peer_review_id", "peer_review_question_id"])
    })
  }
  if (!(await knex.schema.hasTable("spam_flag"))) {
    await knex.schema.createTable("spam_flag", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .notNullable()
      table
        .uuid("quiz_answer_id")
        .references("id")
        .inTable("quiz_answer")
        .notNullable()
        .onDelete("CASCADE")
      table
        .integer("user_id")
        .references("id")
        .inTable("user")
        .notNullable()
        .onDelete("CASCADE")
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
    })
  }
  if (!(await knex.schema.hasTable("user_quiz_state"))) {
    await knex.schema.createTable("user_quiz_state", table => {
      table
        .integer("user_id")
        .references("id")
        .inTable("user")
        .notNullable()
        .onDelete("CASCADE")
      table
        .uuid("quiz_id")
        .references("id")
        .inTable("quiz")
        .notNullable()
        .onDelete("CASCADE")
      table.integer("peer_reviews_given")
      table.integer("peer_reviews_received")
      table.decimal("points_awarded")
      table.integer("spam_flags")
      table.integer("tries")
      table
        .enu("status", ["open", "locked"], {
          useNative: true,
          enumName: "user_quiz_state_status_enum",
        })
        .defaultTo("open")
        .notNullable()
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table.primary(["user_id", "quiz_id"])
    })
  }
  if (!(await knex.schema.hasTable("user_course_part_state"))) {
    await knex.schema.createTable("user_course_part_state", table => {
      table
        .integer("user_id")
        .references("id")
        .inTable("user")
        .notNullable()
        .onDelete("CASCADE")
      table
        .uuid("course_id")
        .references("id")
        .inTable("course")
        .notNullable()
        .onDelete("CASCADE")
      table.integer("course_part").notNullable()
      table
        .decimal("progress")
        .notNullable()
        .defaultTo(0)
      table
        .decimal("score")
        .notNullable()
        .defaultTo(0)
      table
        .boolean("completed")
        .notNullable()
        .defaultTo(false)
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table.primary(["user_id", "course_id", "course_part"])
    })
  }
  if (!(await knex.schema.hasTable("user_course_role"))) {
    await knex.schema.createTable("user_course_role", table => {
      table
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .notNullable()
      table
        .integer("user_id")
        .references("id")
        .inTable("user")
        .notNullable()
        .onDelete("CASCADE")
      table
        .uuid("course_id")
        .references("id")
        .inTable("course")
        .notNullable()
        .onDelete("CASCADE")
      table
        .enu("role", ["assistant", "teacher"], {
          useNative: true,
          enumName: "role_enum",
        })
        .notNullable()
      table
        .timestamp("created_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
      table
        .timestamp("updated_at", { useTz: false })
        .defaultTo(knex.fn.now())
        .notNullable()
    })
  }

  await knex.raw(`
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
    $$ language 'plpgsql'
  `)

  await knex.raw(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON quiz_item
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp()
  `)

  await knex.raw(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON user_quiz_state
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp()
  `)
}

export async function down(knex: Knex): Promise<any> {}
