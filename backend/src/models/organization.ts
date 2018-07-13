import Sequelize from "sequelize"

interface IOrganizationAttributes {
  id: number
}

type OrganizationInstance = Sequelize.Instance<IOrganizationAttributes> &
  IOrganizationAttributes

export default (sequalize: Sequelize.Sequelize) => {
  return sequalize.define<OrganizationInstance, IOrganizationAttributes>(
    "organization",
    {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
    },
  )
}
