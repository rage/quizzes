import { useState, useEffect, MutableRefObject } from "react"

export function useOnScreen<T extends Element>(
  ref: MutableRefObject<T>,
  rootMargin: string = "0px",
  offScreenThreshold: number = 10,
): boolean {
  const [progressShouldUpdate, setProgressShouldUpdate] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const entryTarget = entry.target as HTMLElement

          // a time stamp has been marked
          if (entryTarget.dataset.lastInteractionStarted) {
            // check if it has been long enough
            const secondsOffView =
              (performance.now() -
                Number.parseFloat(entryTarget.dataset.lastInteractionStarted)) /
              1000

            if (secondsOffView >= offScreenThreshold) {
              // fetch data
              console.log("Fetching data...")
              setProgressShouldUpdate(true)
            }

            // reset off view counter
            entryTarget.dataset.lastInteractionStarted = performance
              .now()
              .toString()
          } else {
            // no stamp, so mark when this intersection started
            console.log("Setting time stamp...")
            entryTarget.dataset.lastInteractionStarted = performance
              .now()
              .toString()
          }
        }
      },
      {
        rootMargin,
      },
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => {
      observer.unobserve(ref.current)
    }
  }, [])

  return progressShouldUpdate
}
