export default function useFile() {
  const getFileObjectUrl = (file: File) => {
    if (file) {
      return URL.createObjectURL(file)
    }

    return ''
  }

  return { getFileObjectUrl }
}
