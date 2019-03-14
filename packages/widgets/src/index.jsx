/* eslint-disable import/no-extraneous-dependencies */
import { render } from "react-dom"
import Quiz from "./components/"

const root = document.getElementById("root")

render(
  <div style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
    <Quiz id="" languageId="" accessToken="" />
  </div>,
  root,
)
