import { Get, HttpCode, JsonController, Res } from "routing-controllers"
import knex from "../../config/knex"

@JsonController("/")
export class RootController {
  @HttpCode(200)
  @Get("/")
  public async get() {
    return {}
  }

  @Get("status/healthz")
  public async getHealth(@Res() res: any) {
    try {
      await knex.raw("select 1")
      return res.status(200).send()
    } catch (error) {
      return res.status(500).send()
    }
  }
}
