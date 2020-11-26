import { useState } from 'react'

export function useInput(key: string, initialValue: string | null) {
  const [value, setValue] = useLocalStorage(key, initialValue)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return { value, onChange }
}

export function useLocalStorage(
  key: string,
  initialValue: string | null
): [string | null, (value: string | null) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    return window.localStorage.getItem(key) || initialValue
  })

  const setValue = (value: string | null) => {
    setStoredValue(value)
    if (value === null) {
      window.localStorage.removeItem(key)
    } else {
      window.localStorage.setItem(key, value)
    }
  }

  return [storedValue, setValue]
}
