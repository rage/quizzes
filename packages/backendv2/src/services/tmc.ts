import axios from "axios"
import env from "../util/environment"
import { UserInfo } from "../types"

export const getCurrentUserDetails = async (
  accessToken: string,
): Promise<UserInfo> => {
  const res = await axios.get(
    `${env.TMC_BASE_URL}/api/v8/users/current?show_user_fields=true`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )

  const userInfo = res.data
  return userInfo
}
