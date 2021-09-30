import axios from "axios"
import jwt from "jsonwebtoken"
import { GlobalLogger } from "../middleware/logger"

export const relayNewAnswer = async (data: any) => {
  try {
    await axios.post("http://localhost:5150/new", data, {
      headers: {
        authorization: jwt.sign(
          { source: "quizzes" },
          process.env.JWT_SECRET || "",
        ),
      },
    })
  } catch (error) {
    GlobalLogger.error("plagiarism backend responded with error")
  }
}
