import getUUIDByStringBroken from "uuid-by-string"

export function getUUIDByString(str: string): string {
  return getUUIDByStringBroken("_" + str)
}

export function safeGet<T>(func: () => T, def?: any): T {
  try {
    return func()
  } catch (e) {
    return def
  }
}
