import Sequelize from "sequelize"
import { Language, LanguageModel } from "./language"

interface ITextResource {
  id: string
  language_id: Language | string
  value: string
}

export type TextResource = Sequelize.Instance<ITextResource> & ITextResource
export type TextResourceModel = Sequelize.Model<TextResource, ITextResource>

export default (sequelize: Sequelize.Sequelize): TextResourceModel => {
  const Session = sequelize.define<TextResource, ITextResource>(
    "text_resource",
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      language_id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      value: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    },
  )
  Session.associate = ({ Language }: { Language: LanguageModel }) => {
    Session.belongsTo(Language, {
      foreignKey: "language_id",
      targetKey: "id",
    })
  }
  return Session
}
