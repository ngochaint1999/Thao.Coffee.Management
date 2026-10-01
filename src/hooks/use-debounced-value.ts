import { useEffect, useState } from "react"

/** Debounce a rapidly-changing value (e.g. a search box) to avoid filtering on every keystroke. */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
