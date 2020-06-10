// Update with your config settings.

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "/var/run/postgresql",
      database: process.env.DB_NAME,
    },
  },

  testing: {
    client: "pg",
    connection: {
      host: "/var/run/postgresql",
      database: process.env.DB_NAME,
    },
    /*migrations: {
      directory: './data/migrations',
    },*/
    // seeds: { directory: './data/seeds' },
  },

  production: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    /*migrations: {
      directory: './data/migrations',
    },*/
  },
}
