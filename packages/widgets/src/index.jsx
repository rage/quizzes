/* eslint-disable import/no-extraneous-dependencies */
import { render } from "react-dom"
import * as React from "react"
import Quiz from "./components/"
import "babel-polyfill"

const root = document.getElementById("root")

render(
  <div style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
    <Quiz id="" languageId="fi_FI" accessToken="" />
  </div>,
  root,
)
