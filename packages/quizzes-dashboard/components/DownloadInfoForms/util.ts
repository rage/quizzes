export const createAndSubmitDownloadForm = (
  username: string,
  url: string,
  quizName: string,
  courseName: string,
) => {
  const f = document.createElement("form")
  f.action = url
  f.method = "POST"

  const usernameInput = document.createElement("input")
  usernameInput.type = "hidden"
  usernameInput.name = "username"
  usernameInput.value = username
  f.appendChild(usernameInput)

  const quizNameInput = document.createElement("input")
  quizNameInput.type = "hidden"
  quizNameInput.name = "quizName"
  quizNameInput.value = quizName
  f.appendChild(quizNameInput)

  const courseNameInput = document.createElement("input")
  courseNameInput.type = "hidden"
  courseNameInput.name = "courseName"
  courseNameInput.value = courseName
  f.appendChild(courseNameInput)

  document.body.appendChild(f)
  f.submit()
}

export const HOST =
  process.env.NODE_ENV === "production"
    ? "https://quizzes.mooc.fi"
    : "http://localhost:3003"
