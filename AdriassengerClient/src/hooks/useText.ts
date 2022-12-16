import { ApiError } from '../global'

export default function useText() {
  const truncate = (text: string, length: number) => (text.length > length ? text.slice(0, length) + '...' : text)

  const joinMessages = (arr: ApiError[]) => {
    return arr.map((error) => error.errorMessage + '\n').join()
  }

  const getDateString = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  return { truncate, joinMessages, getDateString }
}
