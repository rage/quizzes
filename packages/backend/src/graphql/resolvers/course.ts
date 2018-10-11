import { getRepository } from "typeorm"
import { Course } from "../../models/course"

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
