import { Course, Language, Organization } from "../../models"
import { getUUIDByString, progressBar } from "./util"

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

  const existingCourses = await Course.find({})
  if (existingCourses.length > 0) {
    console.log("Existing courses found in database, skipping migration")
    for (const course of existingCourses) {
      courses[course.id] = course
    }
    return courses
  }

  const bar = progressBar("Creating courses", Object.entries(courseIDs).length)
  for (const [courseID, language] of Object.entries(courseIDs)) {
    const uuid = getUUIDByString(courseID)
    courses[uuid] = await Course.create({
      id: uuid,
      organization: Promise.resolve(org),
      languages: Promise.resolve([languages[language]]),
    }).save()
    bar.tick()
  }
  return courses
}
