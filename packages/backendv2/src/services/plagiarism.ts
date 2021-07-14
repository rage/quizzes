import axios from "axios"
import { QuizAnswer } from "../models"

export const relayNewAnswer = async (data: any) => {
    try {
        await axios.post("http://localhost:5150/new", data)
    } catch (error) {
        console.log(error)
    }
}