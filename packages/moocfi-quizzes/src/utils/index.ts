export const scrollToRef = (ref: any, block?: string) => {
  ref.current.scrollIntoView({
    behavior: "smooth",
    block: block || "start",
  })
  // ref.current.focus()
}
