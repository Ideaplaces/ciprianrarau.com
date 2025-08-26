export const storageAvailable = (type: string) => {
  try {
    const storage = window[type as keyof Window] as Storage
    const x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (_e) {
    return false
  }
}
