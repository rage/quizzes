import axios from "axios"
import { UserCourseRole } from "../interfaces"

export const getOwnRoles = async (
  accessToken: string,
): Promise<
  Array<{ role: UserCourseRole; courseId: string; courseTitle: string }>
> => {
  const response = await axios.get(`/api/v1/quizzes/usercourserole`, {
    headers: { authorization: `Bearer ${accessToken}` },
  })

  return response.data
}
