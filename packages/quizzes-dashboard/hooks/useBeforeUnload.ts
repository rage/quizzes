import { useEffect } from "react"
import { useTypedSelector } from "../store/store"

export const useBeforeUnload = (fn: (e: BeforeUnloadEvent) => void) => {
  const changes = useTypedSelector(state => state.editor.editorChanges.changes)

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
