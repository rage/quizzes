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

  const estonian = await Language.merge(
    Language.create({
      id: "et_EE",
      country: "Estonia",
      name: "Estonian",
    }),
  ).save()

  const german = await Language.merge(
    Language.create({
      id: "de_DE",
      country: "Germany",
      name: "German",
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
    [estonian.id]: estonian,
    [german.id]: german,
    [unknown.id]: unknown,
  }
}
