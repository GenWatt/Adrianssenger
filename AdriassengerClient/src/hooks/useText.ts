export default function useText() {
  const truncate = (text: string, length: number) => (text.length > length ? text.slice(0, length) + '...' : text)

  return { truncate }
}
