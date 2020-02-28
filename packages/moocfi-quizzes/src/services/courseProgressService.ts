import axios from "axios"
import BASE_URL from "../config"
import { PointsByGroup } from "../modelTypes"
import { GraphQLClient } from "graphql-request"

let graphQLClient: GraphQLClient

const request = async (accessToken: string, query: string) => {
  if (!graphQLClient) {
    graphQLClient = new GraphQLClient(`${process.env.MOOCFI_URL}/api`, {
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
        user_course_progresses(
          where: { course: { id: "${courseId}" } }
        ) {
          n_points
          max_points
          progress
          course {
            exercises {
              id
              quizzes_id: custom_id
              name
              part
              section
              max_points
            }
            withAnswer: exercises(orderBy: part_ASC) {
              id
              custom_id
              part
              section
              exercise_completions(orderBy: updated_at_DESC, first: 1) {
                completed
                n_points
                required_actions {
                  value
                }
              }
            }
          }
        }
        completions(
          where: { course: { id: "${courseId}" } }
        ) {
          id
        }
      }
    }
  `
  const data = await request(accessToken, query)

  console.log(data)
  return data
}
