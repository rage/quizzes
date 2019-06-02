import { Language } from "./models"
import { insert } from "./util/"

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

  const swedish = await Language.merge(
    Language.create({
      id: "sv_SE",
      country: "Sweden",
      name: "Swedish",
    }),
  ).save()

  const unknown = await Language.merge(
    Language.create({
      id: "unknown",
      country: "Unknown",
      name: "Unknown",
    }),
  ).save()

  return {
    [finnish.id]: finnish,
    [english.id]: english,
    [swedish.id]: swedish,
    [unknown.id]: unknown,
  }
}
