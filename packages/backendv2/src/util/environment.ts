import dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: `.env`, quiet: true })
}

export default process.env
