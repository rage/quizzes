export const scrollToRef = (ref: any, block?: string) => {
  ref &&
    ref.current &&
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: block || "start",
    })
}
