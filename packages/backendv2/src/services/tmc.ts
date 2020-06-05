import axios from "axios"
import { UserInfo } from "../types"

export const getCurrentUserDetails = async (
  accessToken: string,
): Promise<UserInfo> => {
  const res = await axios.get(
    `https://tmc.mooc.fi/api/v8/users/current?show_user_fields=true`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )
  const userInfo = res.data
  return userInfo
}
