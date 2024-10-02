import React, { FocusEventHandler, useCallback } from "react"

interface Attrs<T> {
  onFocus?: FocusEventHandler<T>
  onBlur?: FocusEventHandler<T>
}

interface Result<T> extends Attrs<T> {
  isFocused: boolean
}

export const useInputBase = <
  T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>({
  onFocus,
  onBlur,
}: Attrs<T>): Result<T> => {
  const [isFocused, setIsFocused] = React.useState(false)
  const handleOnFocus: FocusEventHandler<T> = useCallback(
    (e) => {
      setIsFocused(true)
      onFocus?.(e)
    },
    [onFocus],
  )
  const handleOnBlur: FocusEventHandler<T> = useCallback(
    (e) => {
      setIsFocused(false)
      onBlur?.(e)
    },
    [onBlur],
  )
  return {
    onBlur: handleOnBlur,
    onFocus: handleOnFocus,
    isFocused,
  }
}
