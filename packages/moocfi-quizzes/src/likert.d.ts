type Props = {
  reviews: any[]
  questionValue?: any
  onClick: (question: any, value: string) => void
  separatorType?: "dotted-line" | "striped"
  icons?: any
  highlightColor?: "string"
  frozen?: boolean
}

declare module "likert-react" {
  import { FunctionComponent } from "react"

  const LikertScale: FunctionComponent<Props>
  export = LikertScale
}
