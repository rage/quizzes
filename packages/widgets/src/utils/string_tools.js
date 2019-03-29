export function wordCount(string) {
  if (!string) {
    return 0
  }
  return string.match(/[^\s]+/g).length
}
