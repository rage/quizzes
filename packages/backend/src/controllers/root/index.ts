import { Get, HttpCode, JsonController } from "routing-controllers"

@JsonController("/")
export class RootController {
  @HttpCode(200)
  @Get("/")
  public async get() {
    return {}
  }
}
