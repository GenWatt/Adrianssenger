import { ApiError } from '../global'

export default function useText() {
  const truncate = (text: string, length: number) => (text.length > length ? text.slice(0, length) + '...' : text)

  const joinMessages = (errors: ApiError[] | string) => {
    if (typeof errors === 'string') {
      return errors
    }
    return errors.map((error) => error.errorMessage + '\n').join()
  }

  const getDateString = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  return { truncate, joinMessages, getDateString }
}
