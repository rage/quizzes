import axios, { AxiosInstance } from 'axios'

// This class is available in a redux thunk action.
// Do not create an instance of this this yourself.
class QuizzesApi {
  api: AxiosInstance
  accessToken: string | null

  constructor(accessToken: string | null) {
    const headers = {}
    if (accessToken && accessToken.trim() !== '') {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
    this.api = axios.create({
      baseURL: 'https://quizzes.mooc.fi/',
      headers
    })
    this.accessToken = accessToken
  }

  async fetchQuiz(id: string) {
    const url = this.accessToken
      ? `/api/v2/widget/quizzes/${id}`
      : `/api/v2/widget/quizzes/${id}/preview`
    const response = await this.api.get(url)

    return response.data
  }
}

export default QuizzesApi
