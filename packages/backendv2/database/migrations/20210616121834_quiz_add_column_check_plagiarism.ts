import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`alter table quiz add column check_plagiarism boolean default false;`)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`alter table quiz drop column check_plagiarism;`)
}

