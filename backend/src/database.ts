import Sequelize from "sequelize"

import languageFactory from "./models/language"
import organizationFactory from "./models/organization"
import textResourceFactory from "./models/textresource"
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
  Language: languageFactory(sequelize),
  TextResource: textResourceFactory(sequelize),
}

Object.values(db).forEach(
  (model: any) => model.associate && model.associate(db),
)

export default db
