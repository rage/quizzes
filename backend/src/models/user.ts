import Sequelize from "sequelize"

interface IUserAttributes {
  id: number
}

type UserInstance = Sequelize.Instance<IUserAttributes> & IUserAttributes

export default (sequalize: Sequelize.Sequelize) => {
  return sequalize.define<UserInstance, IUserAttributes>("user", {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
  })
}
