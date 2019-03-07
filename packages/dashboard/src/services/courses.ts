import axios from "axios"
import TMCApi from "../../../common/src/services/TMCApi"

export const getCourses = async user => {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/courses`,
    {
      headers: { authorization: `Bearer ${user.accessToken}` },
    },
  )
  return response.data
}
