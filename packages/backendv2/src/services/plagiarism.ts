import axios from "axios"
import jwt from "jsonwebtoken"
import { GlobalLogger } from "../middleware/logger"

export const relayNewAnswer = async (data: any) => {
  try {
    const csd_url = process.env.CSD_URL ?? "http://localhost:5150"
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const timeout = setTimeout(() => {
      GlobalLogger.warn("plagiarism detection: request timed out")
      source.cancel()
    }, 10000)
    await axios.post(csd_url + "/new", data, {
      headers: {
        authorization: jwt.sign(
          { source: "quizzes" },
          process.env.JWT_SECRET || "",
        ),
      },
      cancelToken: source.token,
    })
    clearTimeout(timeout)
  } catch (error) {
    console.log(error)
    GlobalLogger.error("plagiarism detection: backend responded with error")
  }
}
