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
  const response = await axios.get(
    `https://quizzes.mooc.fi/api/v1/quizzes/usercoursestate/${courseId}`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  )
  return response.data
}

export const getCompletion = async (
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
}

/*export const getUserCourseData = async (
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

  return data
}*/
