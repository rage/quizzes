/* eslint-disable import/no-extraneous-dependencies */
import { render } from "react-dom"
import Quiz from "./components/"

const root = document.getElementById("root")

render(
  <div style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
    <Quiz
      id="35f69975-2258-4b00-b419-1b98616980e6"
      languageId="fi_FI"
      accessToken="1436f0ed8869efc9d89ce0b6706d9ba07747490e2ed5b2ef3dd18caf0f0ac04a"
    />
  </div>,
  root,
)
