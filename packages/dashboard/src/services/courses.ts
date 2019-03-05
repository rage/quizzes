import axios from "axios"
import TMCApi from "../../../common/src/services/TMCApi"

export const getCourses = async user => {
  const response = await axios.get("http://localhost:3000/api/v1/courses", {
    headers: { authorization: `Bearer ${user.accessToken}` },
  })
  return response.data
}
