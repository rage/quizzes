import { EditableQuiz } from "../../types/EditQuiz"

export interface actionType {
  type: string
  payload: any
}

export interface EditorState {
  editable: boolean
  quiz: EditableQuiz
}

const initialState: EditorState = {
  editable: false,
  quiz: {
    open: null,
    id: "",
    courseId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    deadline: null,
    part: 0,
    section: 0,
    tries: 1,
    triesLimited: true,
    autoConfirm: true,
    grantPointsPolicy: "",
    awardPointsEvenIfWrong: false,
    excludedFromScore: false,
    points: 1,
    peerReviewCollections: [],
    items: [],
    texts: [],
  },
}

const editReducer = (
  state: EditorState = initialState,
  action: actionType,
): EditorState => {
  switch (action.type) {
    case "INITIALIZED_QUIZ": {
      return { ...initialState, quiz: action.payload.quiz }
    }
    case "TOGGLE_EDITABLE": {
      return { editable: !state.editable, quiz: state.quiz }
    }
    default: {
      return initialState
    }
  }
}

export default editReducer
