module.exports = {
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || "/var/run/postgresql",
  logging: process.env.DB_LOGGING === "true" || false,
  password: process.env.DB_PASSWORD || undefined,
  synchronize: false,
  type: "postgres",
  username: process.env.DB_USER || undefined,
  migrations: ["dist/src/migration/*.js"],
  cli: {
    migrationsDir: "src/migration",
  },
  entities: ["./dist/src/models/**/*.js"],
  extra: {
    max: 20,
  },
}
