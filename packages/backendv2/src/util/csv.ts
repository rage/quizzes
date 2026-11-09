import { pipeline, type Readable } from "stream"

import { stringify, type Options, type Stringifier } from "csv-stringify"

const FORMULA_START = /^[=+\-@\t\r\uFF1D\uFF0B\uFF0D\uFF20]/
// Numeric-looking strings (pg returns decimals as strings) such as "-1" are harmless and must stay intact.
const PLAIN_NUMBER = /^-?\d+(\.\d+)?$/

/** Neutralizes spreadsheet formulas in untrusted text by prefixing an apostrophe. */
const escapeFormula = (value: string) =>
  FORMULA_START.test(value) && !PLAIN_NUMBER.test(value) ? `'${value}` : value

/**
 * Formats a row stream as CSV. Errors from `rows` are emitted on the returned
 * stream, so a failing query fails the response instead of crashing the process.
 * Text cells starting with a formula character are prefixed with `'`.
 */
export const toCsvStream = (rows: Readable, options: Options): Stringifier =>
  pipeline(
    rows,
    stringify({ ...options, cast: { string: escapeFormula } }),
    () => {},
  )
