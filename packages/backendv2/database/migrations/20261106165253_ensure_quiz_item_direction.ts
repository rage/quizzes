import type { Knex } from "knex"

// 20201123185651_add_quiz_item_direction adds the column only in production,
// where it also rebuilds the reaktor views; this adds it everywhere else.
export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'quiz_item'
          AND column_name = 'direction'
      ) THEN
        CREATE TYPE quiz_item_direction_enum AS ENUM ('column', 'row');

        ALTER TABLE quiz_item
          ADD COLUMN direction quiz_item_direction_enum NOT NULL DEFAULT 'row';

        UPDATE quiz_item
        SET direction = 'column'
        WHERE quiz_id IN (
          SELECT quiz_id
          FROM quiz_item
          GROUP BY quiz_id
          HAVING count(*) = 1
        );
      END IF;
    END
    $$
  `)
}

// Dropping would destroy the production column this migration did not create.
export async function down(): Promise<void> {}
