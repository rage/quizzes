const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://quizzes.mooc.fi"
    : "http://localhost:3000"

export default BASE_URL
