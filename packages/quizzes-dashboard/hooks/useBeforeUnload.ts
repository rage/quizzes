import { useEffect } from "react"

export const useBeforeUnload = (
  fn: (e: BeforeUnloadEvent) => void,
  changes: boolean,
) => {
  useEffect(() => {
    if (changes) {
      addEventListener("beforeunload", fn)

      return () => {
        removeEventListener("beforeunload", fn)
      }
    }
  }, [changes])
}

export default useBeforeUnload
