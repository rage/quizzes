/* eslint-disable import/no-extraneous-dependencies */
import { render } from "react-dom"
import Quiz from "./components/"

const root = document.getElementById("root")

render(
  <div style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
    <Quiz
      id="a28fc803-8173-4df9-bf73-d6e40e96ce0f"
      languageId="fi_FI"
      accessToken="1436f0ed8869efc9d89ce0b6706d9ba07747490e2ed5b2ef3dd18caf0f0ac04a"
    />
  </div>,
  root,
)
