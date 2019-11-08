import * as React from "react"
import { Button } from "@material-ui/core"

const ReceivedPeerReviews: React.FunctionComponent<any> = () => {
  const [modalOpened, setModalOpened] = React.useState(false)

  return (
    <>
      {modalOpened ? (
        <div>Now showing the detailed info of all the reviews</div>
      ) : (
        <div>Showing the summary of the peer reviews you've received</div>
      )}
      <Button variant="outlined" onClick={() => setModalOpened(!modalOpened)}>
        Toggle mode
      </Button>
    </>
  )
}

export default ReceivedPeerReviews
