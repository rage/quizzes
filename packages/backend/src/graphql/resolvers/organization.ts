import { Organization } from "@quizzes/common/models/organization"
import { getRepository } from "typeorm"

export const organizationResolver = {
  async organization(
    obj: any,
    { id }: { id: number },
    context: any,
    info: any,
  ) {
    const repository = getRepository(Organization)
    return await repository.findOne({ id })
  },
}
