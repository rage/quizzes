import { createContext, useState } from "react"

export interface CrumbItem {
  label: string
  as?: string
  href?: string
}

interface BreadCrumbContextType {
  breadCrumbs: CrumbItem[]
  setBreadCrumbs: (items: CrumbItem[]) => void
}

const breadCrumbContextDefault = {
  breadCrumbs: [],
  setBreadCrumbs: () => {},
}

const BreadCrumbContext = createContext<BreadCrumbContextType>(
  breadCrumbContextDefault,
)

export const BreadCrumbs = ({ children }: { children: any }) => {
  const [breadCrumbs, setBreadCrumbs] = useState<CrumbItem[]>([])
  return (
    <BreadCrumbContext.Provider value={{ breadCrumbs, setBreadCrumbs }}>
      {children}
    </BreadCrumbContext.Provider>
  )
}

export default BreadCrumbContext
