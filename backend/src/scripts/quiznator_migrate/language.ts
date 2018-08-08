import { Connection } from "typeorm"
import { Language } from "../../models"

export async function createLanguages(): Promise<{
  [languageID: string]: Language
}> {
  const finnish = await Language.merge(
    Language.create({
      id: "fi_FI",
      country: "Finland",
      name: "Finnish",
    }),
  ).save()
  const english = await Language.merge(
    Language.create({
      id: "en_US",
      country: "United States",
      name: "English",
    }),
  ).save()

  return {
    [finnish.id]: finnish,
    [english.id]: english,
  }
}
