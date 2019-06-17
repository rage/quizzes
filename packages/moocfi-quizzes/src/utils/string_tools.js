export function wordCount(string) {
  if (!string) {
    return 0
  }
  const matches = string.match(/[^\s]+/g)
  return matches ? string.match(/[^\s]+/g).length : 0
}
