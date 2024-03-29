import axios from "axios"
import BASE_URL from "../config"
import { PointsByGroup } from "../modelTypes"
import { GraphQLClient } from "graphql-request"
import { UserCourseSummaryResponse } from "../contexes/courseProgressProviderContext"

let graphQLClient: GraphQLClient

const request = async <T = any>(accessToken: string, query: string) => {
  if (!graphQLClient) {
    graphQLClient = new GraphQLClient(`https://www.mooc.fi/api`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
  }
  return await graphQLClient.request<T>(query)
}

/*export const getUserCourseData = async (
  courseId: string,
  accessToken: string,
): Promise<any> => {
  const response = await axios.get(
    `https://quizzes.mooc.fi/api/v1/quizzes/usercoursestate/${courseId}`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  )
  return response.data
}*/

/*export const getCompletion = async (
  courseId: string,
  accessToken: string,
): Promise<any> => {
  const query = `
    {
      currentUser {
        completions(
          course_id: "55dff8af-c06c-4a97-88e6-af7c04d252ca"
        ) {
          id
        }
      }
    }
  `
  return await request(accessToken, query)
}*/

export const getUserCourseSummary = async (
  courseId: string,
  accessToken: string,
) => {
  const query = `
    {
      currentUser {
        user_course_summary(course_id: "${courseId}", includeNoPointsAwardedExercises: true) {
          user_course_progress {
            max_points
            n_points
            progress
          }
          completion {
            id
          }
          course {
            points_needed
            exercises {
              id
              quizzes_id: custom_id
              name
              part
              section
              max_points
            }
          }
          exercise_completions {
            exercise_id
            completed
            n_points
            exercise_completion_required_actions {
              value
            }
          }
        }
      }
    }
  `

  const data = await request<{
    currentUser: { user_course_summary?: Array<UserCourseSummaryResponse> }
  }>(accessToken, query)

  return data
}

export const getUserCourseData = async (
  courseId: string,
  accessToken: string,
): Promise<any> => {
  const query = `
    {
      currentUser {
        user_course_progressess(course_id: "${courseId}") {
          max_points
          n_points
          progress
          course {
            exercises {
              id
              quizzes_id: custom_id
              name
              part
              section
              max_points
              exercise_completions(orderBy: { updated_at: desc}) {
                completed
                n_points
                exercise_completion_required_actions {
                  value
                }
              }
            }
          }
        }
        completions(course_id: "${courseId}") {
          id
        }
      }
      course(id: "${courseId}") {
        exercises {
          id
          quizzes_id: custom_id
          name
          part
          section
          max_points
        }
      }
    }
  `
  const data = await request(accessToken, query)

  return data
}
