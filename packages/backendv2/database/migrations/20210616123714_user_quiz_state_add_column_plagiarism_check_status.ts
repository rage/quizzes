import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`create type plagiarism_check_status_enum as enum('plagiarism-suspected', 'plagiarism-not-suspected', 'not-started', 'in-progress');
    `)
    await knex.raw('alter table user_quiz_state add column plagiarism_check_status plagiarism_check_status_enum;')
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`alter table user_quiz_state drop column plagiarism_check_status;`)
    await knex.raw(`drop type plagiarism_check_status_enum;`)
}

