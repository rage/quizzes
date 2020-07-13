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

export const setTestingRegex = createAction(
  "SET_TESTING_REGEX",
  (itemId: string, testing: boolean) => ({
    itemId: itemId,
    testing: testing,
  }),
)<{ itemId: string; testing: boolean }>()

export const setRegex = createAction(
  "SET_TEST_REGEX",
  (itemId: string, testRegex: string) => ({
    itemId: itemId,
    testRegex: testRegex,
  }),
)<{ itemId: string; testRegex: string }>()

export const setRegexTestAnswer = createAction(
  "SETREGEX_TESTANSWER",
  (itemId: string, testAnswer: string) => ({
    itemId: itemId,
    testAnswer: testAnswer,
  }),
)<{ itemId: string; testAnswer: string }>()

export const setValidRegex = createAction(
  "SET_VALIDREGEX",
  (itemId: string, valid: boolean) => ({
    itemId: itemId,
    valid: valid,
  }),
)<{ itemId: string; valid: boolean }>()
