import Sequelize from "sequelize"

interface ILanguage {
  id: string
  name: string
  country: string
}

export type Language = Sequelize.Instance<ILanguage> & ILanguage
export type LanguageModel = Sequelize.Model<Language, ILanguage>

export default (sequelize: Sequelize.Sequelize): LanguageModel => {
  return sequelize.define<Language, ILanguage>("language", {
    id: {
      primaryKey: true,
      type: Sequelize.STRING,
    },
    name: Sequelize.STRING,
    country: Sequelize.STRING,
  })
}
