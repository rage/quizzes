import Sequelize from "sequelize"

import organizationFactory from "./models/organization"
import userFactory from "./models/user"

const sequelize = new Sequelize("tulir", "", "", {
  host: "/var/run/postgresql",

  dialect: "postgres",

  pool: {
    max: 5,
    min: 0,

    acquire: 30000,
    idle: 10000,
  },

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false,
})

const db = {
  Sequelize,
  sequelize,

  Organization: organizationFactory(sequelize),
  User: userFactory(sequelize),
}

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db)
  }
})

export default db
