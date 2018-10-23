import axios from 'axios'

export const getQuizzes = async () => {
    const response = await axios.get('http://localhost:3000/api/v1/quizzes?items=true&options=true&peerreviews=true')
    return response.data
}
