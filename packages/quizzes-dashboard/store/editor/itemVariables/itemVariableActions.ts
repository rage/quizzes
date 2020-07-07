import { createAction } from "typesafe-actions"

export const setAdvancedEditing = createAction(
  "SET_ADVANCED_EDITING",
  (itemId: string, editing: boolean) => ({ itemId: itemId, editing: editing }),
)<{ itemId: string; editing: boolean }>()

export const setScaleMax = createAction(
  "SET_SCALE_MAX",
  (itemId: string, newValue: number, valid: boolean) => ({
    itemId: itemId,
    newValue: newValue,
    valid: valid,
  }),
)<{ itemId: string; newValue: number; valid: boolean }>()

export const setScaleMin = createAction(
  "SET_SCALE_MIN",
  (itemId: string, newValue: number, valid: boolean) => ({
    itemId: itemId,
    newValue: newValue,
    valid: valid,
  }),
)<{ itemId: string; newValue: number; valid: boolean }>()
