import { useLayoutEffect, useState } from "react"
export function useScreenParams(): [number, number] {
  const [values, setValues] = useState<[number, number]>([window?.screen?.width, window?.screen?.height])

  useLayoutEffect(() => {
    const onResize = () => {
      setValues([window?.screen?.width, window?.screen?.height])
    }
    window?.addEventListener("resize", onResize)
    return () => {
      window?.removeEventListener("resize", onResize)
    }
  })

  return values
}
