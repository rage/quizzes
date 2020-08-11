import { useEffect } from "react"
import { useTypedSelector } from "../store/store"

export const useBeforeUnload = () => {
  const changes = useTypedSelector(state => state.editor.editorChanges.changes)

  useEffect(() => {
    if (changes) {
      window.addEventListener("beforeunload", e => {
        e.preventDefault()
        e.returnValue = ""
      })
      return () =>
        window.removeEventListener("beforeunload", e => {
          e.preventDefault()
          e.returnValue = ""
        })
    }
  }, [changes])
}

export default useBeforeUnload
