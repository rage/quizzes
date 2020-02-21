import axios from "axios"
import BASE_URL from "../config"
import { PointsByGroup } from "../modelTypes"

export const getUserCourseData = async (
  courseId: string,
  accessToken: string,
): Promise<any> => {
  return {
    requiredActions: (await axios.get(
      `${BASE_URL}/api/v1/quizzes/usercoursestate/${courseId}/required-actions`,
      { headers: { authorization: `Bearer ${accessToken}` } },
    )).data,
    userCourseProgress: (await axios.get(
      `${BASE_URL}/api/v1/courses/${courseId}/users/current/progress`,
      { headers: { authorization: `Bearer ${accessToken}` } },
    )).data.points_by_group,
  }
}
