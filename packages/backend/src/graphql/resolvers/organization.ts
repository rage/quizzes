import { getRepository } from "typeorm"
import { Organization } from "../../models/organization"

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
