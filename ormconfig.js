module.exports = {
    database: process.env.DB_NAME || "quizzes",
    host: process.env.DB_HOST || "/var/run/postgresql",
    logging: !!process.env.DB_LOGGING || true,
    password: process.env.DB_PASSWORD || undefined,
    synchronize: true,
    type: "postgres",
    username: process.env.DB_USER || undefined,
    migrations: ["dist/common/src/migration/*.js"],
    cli: {
        migrationsDir: "packages/common/src/migration"
    }
}