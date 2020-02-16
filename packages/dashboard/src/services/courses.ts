import axios from "axios"
import TMCApi from "../../../common/src/services/TMCApi"

export const getCourses = async user => {
  const response = await axios.get(`/api/v1/courses?attentionAnswers=true`, {
    headers: { authorization: `Bearer ${user.accessToken}` },
  })
  return response.data
}
