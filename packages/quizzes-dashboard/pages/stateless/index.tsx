import { Typography } from "@material-ui/core"
import React from "react"
import StatelessEditor from "../../components/StatelessEditor"

const Stateless: React.FC = () => {
  return <StatelessEditor />
}
// @ts-ignore
Stateless.noLayout = true

export default Stateless
