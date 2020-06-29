import BreadCrumbContext, { CrumbItem } from "../contexts/BreadCrumbContext"
import { useEffect, useContext } from "react"

const useBreadcrumbs = (crumbs: CrumbItem[]) => {
  const { setBreadCrumbs } = useContext(BreadCrumbContext)
  useEffect(() => {
    setBreadCrumbs(crumbs)
  }, [JSON.stringify(crumbs)])
}

export default useBreadcrumbs
