import axios from "axios"

export const getCourses = async () => {
  const response = await axios.get("http://localhost:3000/api/v1/courses")
  return response.data
}
