import { Get, HeaderParam, JsonController } from "routing-controllers"
import UserCourseRoleService from "services/usercourserole.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { API_PATH } from "../../config"
import { ITMCProfileDetails } from "../../types"

@JsonController(`${API_PATH}/quizzes/usercourserole/1`)
export class UserCourseRoleController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private userCourseRoleService: UserCourseRoleService

  @Get("/")
  public async getOwn(
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<any[] | string> {
    try {
      console.log("User info: ", user)
      if (user.administrator) {
        return "administrator"
      }

      const roles = await this.userCourseRoleService.getUserCourseRoles({
        userId: user.id,
      })

      console.log("Roles: ", roles)
      const result = roles.map(r => ({
        role: r.role,
        courseId: r.courseId,
      }))
      console.log("Result: ", result)

      return result
    } catch (e) {
      console.log(e)
      throw new Error("Thewe was someting wrong:")
    }
  }
}
