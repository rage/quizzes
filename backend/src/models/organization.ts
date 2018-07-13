import Sequelize from "sequelize"

interface IOrganization {
  id: number
}

export type Organization = Sequelize.Instance<IOrganization> & IOrganization
export type OrganizationModel = Sequelize.Model<Organization, IOrganization>

export default (sequelize: Sequelize.Sequelize): OrganizationModel => {
  return sequelize.define<Organization, IOrganization>("organization", {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
  })
}
