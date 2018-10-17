import { Course } from "@quizzes/common/models/course"
import { getRepository } from "typeorm"

export const courseResolver = {
  async course(obj: any, { id }: { id: string }, context: any, info: any) {
    const repository = getRepository(Course)
    return await repository.findOne({ id })
  },

  async courses() {
    const repository = getRepository(Course)
    return await repository.find()
  },
}
