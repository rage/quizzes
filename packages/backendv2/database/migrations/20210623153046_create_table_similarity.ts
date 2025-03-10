import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    create table similarity
        (
            id               uuid primary key default uuid_generate_v4(),
            target_vector_id uuid not null,
            source_vector_id uuid not null,
            similarity numeric not null,
            foreign key (target_vector_id)
                references vector,
            foreign key (source_vector_id)
                references vector
        );
    `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("drop table similarity;")
}
