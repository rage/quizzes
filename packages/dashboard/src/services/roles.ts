import axios from "axios"
import { IUserCourseRole } from "../interfaces"

export const getOwnRoles = async (
  accessToken: string,
): Promise<IUserCourseRole[]> => {
  const response = await axios.get(`/api/v1/usercourseroles`, {
    headers: { authorization: `Bearer ${accessToken}` },
  })

  return response.data
}
