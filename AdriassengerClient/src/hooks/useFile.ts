import { SERVER_URL } from '../config'

export default function useFile() {
  const getFileObjectUrl = (file: File) => {
    if (file) {
      return URL.createObjectURL(file)
    }

    return ''
  }

  const getStaticFile = (path: string) => {
    if (!path) return ''

    return SERVER_URL + path
  }

  return { getFileObjectUrl, getStaticFile }
}
