import {
  Course,
  CourseTranslation,
  Language,
  Organization,
} from "./models"
import { progressBar } from "./util"
import { getUUIDByString, insert } from "./util/"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { InsertResult } from "typeorm"

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
  "elements-of-ai-fi": "fi_FI",
  "elements-of-ai-se": "sv_SE",

  "k2017-ohpe": "fi_FI",
  "s2017-ohpe": "fi_FI",
  "k2018-ohpe": "fi_FI",

  "s2017-ohja": "fi_FI",
  "k2018-ohja": "fi_FI",

  "wepa-s17": "fi_FI",

  "tikape-s17": "fi_FI",
  "tikape-k18": "fi_FI",

  "tsoha-18": "fi_FI",

  "ohjelmoinnin-mooc-2019": "fi_FI",

  "tietokantojen-perusteet-k2019": "fi_FI",

  "web-palvelinohjelmointi-java-19": "fi_FI",

  "tietoliikenteen-perusteet": "fi_FI",

  "tietokoneen-toiminnan-perusteet": "fi_FI",

  default: "unknown",
}

export async function migrateCourses(
  org: Organization,
  languages: { [languageID: string]: Language },
): Promise<{ [courseID: string]: Course }> {
  const courses: { [key: string]: Course } = {}
  const courseTranslations: Array<QueryPartialEntity<CourseTranslation>> = []

  const existingCourses = await Course.find({})
  if (existingCourses.length > 0) {
    console.log("Existing courses found in database, skipping migration")
    for (const course of existingCourses) {
      courses[course.id] = course
    }
    return Promise.resolve(courses)
  }

  const bar = progressBar("Creating courses", Object.entries(courseIDs).length)
  await Promise.all(
    Object.entries(courseIDs).map(
      async ([courseID, languageID]: [string, string]) => {
        const uuid = getUUIDByString(courseID)
        courses[uuid] = await Course.create({
          id: uuid,
          organizationId: org.id,
          languages: [languages[languageID]],
        }).save()
        courseTranslations.push({
          courseId: uuid,
          languageId: languageID,
          abbreviation: courseID,
          title: courseID,
        })
        bar.tick()
      },
    ),
  )

  console.log("done")

  // await insert(Course, courses)
  await insert(
    CourseTranslation,
    courseTranslations,
    `"course_id", "language_id"`,
  )

  /*   const newCourses: { [courseID: string] : Course } = {}
  
  for (const course of await Course.find({})) {
    newCourses[course.id] = await course
  } */

  return courses // I guess it won't need the translations in migration
}
