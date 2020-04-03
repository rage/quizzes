import ContentLoader from "react-content-loader"
import * as React from "react"
import styled from "styled-components"
import TopInfoBar from "./TopInfoBar"
import SubmitButton from "./SubmitButton"
import { useTypedSelector } from "../../state/store"
import LoginPrompt from "./LoginPrompt"
import { CustomContent } from "./"

const ContentWrapper = styled.div`
  padding: 1rem;
`

interface ILoadingQuizProps {
  content?: CustomContent
  accessToken?: string
}

const LoadingQuiz: React.FunctionComponent<ILoadingQuizProps> = ({
  content,
  accessToken,
}) => {
  const displayBars = useTypedSelector(state => state.loadingBars)

  if (content && content.Loading) {
    return <>{content.Loading}</>
  }

  return (
    <div>
      <TopInfoBar />
      {!accessToken && (
        <LoginPrompt
          content={content && content.Login}
          fullQuizInfoShown={true}
        />
      )}

      <ContentWrapper>
        {displayBars ? (
          <ContentLoader
            height={200}
            width={400}
            speed={2}
            primaryColor="#000000"
            primaryOpacity={0.12}
            secondaryColor="#000000"
            secondaryOpacity={0.26}
            style={{ height: "400px" }}
          >
            <rect x="0" y="15" rx="4" ry="4" width="360" height="6" />
            <rect x="0" y="35" rx="3" ry="3" width="365" height="6" />
            <rect x="0" y="55" rx="3" ry="3" width="125" height="6" />
            <rect x="0" y="100" rx="3" ry="3" width="348" height="6" />
            <rect x="0" y="120" rx="3" ry="3" width="380" height="6" />
            <rect x="0" y="140" rx="3" ry="3" width="222" height="6" />
            <rect x="0" y="160" rx="3" ry="3" width="370" height="6" />
            <rect x="0" y="180" rx="3" ry="3" width="340" height="6" />
          </ContentLoader>
        ) : (
          <div style={{ height: "400px" }} />
        )}
        {accessToken && <SubmitButton />}
      </ContentWrapper>
    </div>
  )
}

export default LoadingQuiz
