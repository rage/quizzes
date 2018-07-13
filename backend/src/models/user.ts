import Sequelize from "sequelize"

interface IUser {
  id: number
}

export type User = Sequelize.Instance<IUser> & IUser
export type UserModel = Sequelize.Model<User, IUser>

export default (sequelize: Sequelize.Sequelize): UserModel => {
  return sequelize.define<User, IUser>("user", {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
  })
}
