export interface actionType {
  type: string
  payload: any
}

export interface editState {
  editable: boolean
}

const initialState: editState = {
  editable: false,
}

const editReducer = (
  state: editState = initialState,
  action: actionType,
): editState => {
  switch (action.type) {
    case "TOGGLE_EDITABLE": {
      return { editable: !state.editable }
    }
    default: {
      return initialState
    }
  }
}

export default editReducer
