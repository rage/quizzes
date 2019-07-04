export const wordCount = (str: string) => {
  if (!str) {
    return 0
  }
  const matches = str.match(/[^\s]+/g)
  return matches ? matches.length : 0
}
