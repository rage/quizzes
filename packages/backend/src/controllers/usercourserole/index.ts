import { Get, HeaderParam, JsonController } from "routing-controllers"
import UserCourseRoleService from "services/usercourserole.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import { API_PATH } from "../../config"
import { ITMCProfileDetails } from "../../types"

@JsonController(`${API_PATH}/usercourseroles`)
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
      if (user.administrator) {
        return [{ role: "administrator", courseId: "", courseName: "" }]
      }

      const roles = await this.userCourseRoleService.getUserCourseRoles({
        userId: user.id,
      })

      const result = roles.map(r => ({
        role: r.role,
        courseId: r.courseId,
        courseTitle: r.course.texts[0].title,
      }))

      return result
    } catch (e) {
      console.log(e)
      throw new Error("There was someting wrong")
    }
  }
}
