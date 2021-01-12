import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    return await knex.raw(`
        ALTER TYPE role_enum ADD VALUE 'reviewer'
    `)
}

export async function down(knex: Knex): Promise<void> {}
