import axios from "axios"
import jwt from "jsonwebtoken"
import { GlobalLogger } from "../middleware/logger"

const CancelToken = axios.CancelToken
const source = CancelToken.source()

export const relayNewAnswer = async (data: any) => {
  try {
    await axios.post("https://csd.mooc.fi/new", data, {
      headers: {
        authorization: jwt.sign(
          { source: "quizzes" },
          process.env.JWT_SECRET || "",
        ),
      },
      cancelToken: source.token,
    })
    setTimeout(() => {
      GlobalLogger.warn("plagiarism detection: request timed out")
      source.cancel()
    }, 10000)
  } catch (error) {
    GlobalLogger.error("plagiarism detection: backend responded with error")
  }
}
