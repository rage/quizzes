import { useDispatch } from "react-redux"

import {
  editedScaleMaxValue,
  editedScaleMinValue,
} from "../../../../store/editor/items/itemAction"
import {
  setScaleMax,
  setScaleMin,
} from "../../../../store/editor/itemVariables/itemVariableActions"
import { useTypedSelector } from "../../../../store/store"

const SCALE_MAX_LIMIT = 10

/**
 * Change handlers for a scale item's min and max fields.
 *
 * Both bounds are revalidated on every edit; the item is only updated while the range is valid.
 */
export const useScaleRange = (itemId: string) => {
  const dispatch = useDispatch()
  const variables = useTypedSelector(
    (state) => state.editor.itemVariables[itemId],
  )

  const update = (min: number, max: number) => {
    const isMinValid = min >= 0 && min < max
    const isMaxValid = max >= 0 && max > min && max <= SCALE_MAX_LIMIT
    dispatch(setScaleMin(itemId, min, isMinValid))
    dispatch(setScaleMax(itemId, max, isMaxValid))
    if (isMinValid && isMaxValid) {
      dispatch(editedScaleMinValue(itemId, min))
      dispatch(editedScaleMaxValue(itemId, max))
    }
  }

  return {
    onMinChange: (min: number) => update(min, variables.scaleMax),
    onMaxChange: (max: number) => update(variables.scaleMin, max),
  }
}
