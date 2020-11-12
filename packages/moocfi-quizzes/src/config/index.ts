const BASE_URL: string =
  process.env.NODE_ENV === "production"
    ? "https://quizzes.mooc.fi"
    : "http://localhost:3003"

export default BASE_URL
