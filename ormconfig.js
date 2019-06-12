module.exports = {
    database: process.env.DB_NAME || "quizzes",
    host: process.env.DB_HOST || "/var/run/postgresql",
    logging: false,
    password: process.env.DB_PASSWORD || undefined,
    synchronize: false,
    type: "postgres",
    username: process.env.DB_USER || undefined,
    migrations: ["dist/backend/src/migration/*.js"],
    cli: {
        migrationsDir: "packages/backend/src/migration"
    },
    entities: ["./dist/backend/src/models/**/*.js"]
}