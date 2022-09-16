export default function useLocalStorage() {
  const setObj = <T extends {}>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value))
  const getObj = <T extends {}>(key: string): T | null => {
    const data = localStorage.getItem(key)
    if (!data) return null
    return JSON.parse(data)
  }

  return { setObj, getObj }
}
