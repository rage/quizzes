import axios from "axios"
import BASE_URL from "../config"
import { PointsByGroup } from "../modelTypes"
import { GraphQLClient } from "graphql-request"

let graphQLClient: GraphQLClient

const request = async (accessToken: string, query: string) => {
  if (!graphQLClient) {
    graphQLClient = new GraphQLClient(`https://www.mooc.fi/api`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
  }
  return await graphQLClient.request(query)
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
