import { useEffect, useContext } from "react"

import BreadCrumbContext, { CrumbItem } from "../contexts/BreadCrumbContext"

const useBreadcrumbs = (crumbs: CrumbItem[]) => {
  const { setBreadCrumbs } = useContext(BreadCrumbContext)
  useEffect(() => {
    setBreadCrumbs(crumbs)
  }, [JSON.stringify(crumbs)])
}

export default useBreadcrumbs
