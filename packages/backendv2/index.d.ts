import { Config } from "knex"

declare module "knexfile" {
  const knexConfig: Config
  export default knexConfig
}
