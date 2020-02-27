import axios from "axios"
import BASE_URL from "../config"
import { PointsByGroup } from "../modelTypes"

export const getUserCourseData = async (
  courseId: string,
  accessToken: string,
): Promise<any> => {
  const response = await axios.post(
    `${process.env.MOOCFI_URL}/api`,
    {
      operationName: null,
      variables: {},
      query: `
        {
          currentUser {
            user_course_progresses(
              where: { course: { id: "${courseId}" } }
            ) {
              n_points
              max_points
              progress
              course {
                exercises(orderBy: part_ASC) {
                  custom_id
                  part
                  section
                  ExerciseCompletions(orderBy: updated_at_DESC, first: 1) {
                    user {id}
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
      `,
    },
    {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    },
  )
  console.log(response.data)
  return response.data
  /*return {
    requiredActions: (await axios.get(
      `${BASE_URL}/api/v1/quizzes/usercoursestate/${courseId}/required-actions`,
      { headers: { authorization: `Bearer ${accessToken}` } },
    )).data,
    userCourseProgress: (await axios.get(
      `${BASE_URL}/api/v1/courses/${courseId}/users/current/progress`,
      { headers: { authorization: `Bearer ${accessToken}` } },
    )).data.points_by_group,
  }*/
}
