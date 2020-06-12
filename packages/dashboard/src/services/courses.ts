import axios from "axios"
import { ICourse } from "../interfaces"

export const getCourses = async (user) => {
  const response = await axios.get(`/api/v1/courses?attentionAnswers=true`, {
    headers: { authorization: `Bearer ${user.accessToken}` },
  })
  return response.data
}

export const duplicateCourse = async (
  courseId: string,
  title: string,
  abbreviation: string,
  user: any,
): Promise<{
  newCourse: ICourse
  correspondanceData: any[]
}> => {
  const response = await axios.post(
    `/api/v1/courses/${courseId}/duplicate`,
    {
      title,
      slug: abbreviation,
    },
    {
      headers: { authorization: `Bearer ${user.accessToken}` },
    },
  )
  return response.data
}

export const getCourseQuizIdCorrespondense = async (
  newCourseId,
  oldCourseId,
  user: any,
): Promise<any[]> => {
  const response = await axios.get(
    `/api/v1/courses/${newCourseId}/quizIdFile?oldCourse=${oldCourseId}`,
    {
      headers: { authorization: `Bearer ${user.accessToken}` },
    },
  )

  return response.data
}
