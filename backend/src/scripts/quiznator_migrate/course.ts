import { Course, Language, Organization } from "../../models"
import { getUUIDByString } from "./util"

const courseIDs = {
  "cybersecurity-intro": "en_US",
  "cybersecurity-securing-software": "en_US",
  "cybersecurity-advanced": "en_US",
  "cybersecurity-intro-17": "en_US",
  "cybersecurity-securing-17": "en_US",
  "cybersecurity-advanced-17": "en_US",
  "securing-17": "en_US",
  "cyber-advanced-17": "en_US",
  "cyber-advanced-18": "en_US",

  "elements-of-ai": "en_US",

  "k2017-ohpe": "fi_FI",
  "s2017-ohpe": "fi_FI",
  "k2018-ohpe": "fi_FI",

  "s2017-ohja": "fi_FI",
  "k2018-ohja": "fi_FI",

  "wepa-s17": "fi_FI",

  "tikape-s17": "fi_FI",
  "tikape-k18": "fi_FI",

  "tsoha-18": "fi_FI",
}

export async function migrateCourses(
  org: Organization,
  languages: { [languageID: string]: Language },
): Promise<{ [courseID: string]: Course }> {
  const courses: { [key: string]: Course } = {}
  for (const [courseID, language] of Object.entries(courseIDs)) {
    const uuid = getUUIDByString(courseID)
    console.log("Creating course", uuid, courseID, language)
    courses[courseID] = Course.merge(
      Course.create({
        id: uuid,
        organization: org,
        languages: [languages[language]],
      }),
    )
    courses[courseID].save()
  }
  return courses
}
