import { Get, HttpCode, JsonController, Res } from "routing-controllers"
import { Quiz } from "../../models"
import { InjectManager } from "typeorm-typedi-extensions"
import { EntityManager } from "typeorm"

@JsonController("/")
export class RootController {
  @InjectManager()
  private entityManager: EntityManager

  @HttpCode(200)
  @Get("/")
  public async get() {
    return {}
  }

  @Get("api/healthz")
  public async getHealth(@Res() res: any) {
    try {
      const quiz = this.entityManager
        .createQueryBuilder(Quiz, "quiz")
        .where("quiz.id = :id", { id: "83d2b8b8-53e7-40b0-bb04-4369151ac75b" })
        .getOne()
      return res.status(200).json({ data: quiz })
    } catch (error) {
      return res.status(500).send()
    }
  }
}
